import { Request, Response } from 'express';
import pool from '../config/db';
import { broadcast } from '../sockets/notifier';

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    // Asumimos userId = 1 por ahora, según lo solicitado
    const currentUserId = 1;

    const query = `
      SELECT m.*, u.username, 
        CASE WHEN ml.message_id IS NOT NULL THEN true ELSE false END AS is_liked_by_me
      FROM messages m 
      LEFT JOIN users u ON m.user_id = u.id 
      LEFT JOIN message_likes ml ON m.id = ml.message_id AND ml.user_id = $1
      ORDER BY m.created_at DESC 
      LIMIT 50
    `;
    const result = await pool.query(query, [currentUserId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, userId } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      res.status(400).json({ error: 'Text content is required and cannot be empty' });
      return;
    }

    // Fallback de seguridad: si no envían userId, usamos 1 por defecto
    const finalUserId = userId || 1;

    const query = `
      WITH inserted_message AS (
        INSERT INTO messages (text, user_id) 
        VALUES ($1, $2) 
        RETURNING *
      )
      SELECT m.*, u.username, false AS is_liked_by_me
      FROM inserted_message m
      LEFT JOIN users u ON m.user_id = u.id;
    `;

    const result = await pool.query(query, [text.trim(), finalUserId]);
    const newMessage = result.rows[0];

    // Broadcast new message event to all WebSocket clients
    broadcast('NEW_MESSAGE', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const likeMessage = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const messageId = parseInt(req.params.id as string, 10);
    const { userId } = req.body;

    if (!userId || isNaN(messageId)) {
      res.status(400).json({ error: 'Valid message ID and userId are required' });
      return;
    }

    await client.query('BEGIN');

    // Check if the message exists to get the author's user_id and text
    const messageCheck = await client.query('SELECT user_id, text FROM messages WHERE id = $1', [messageId]);
    if (messageCheck.rowCount === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Message not found' });
      return;
    }
    const authorId = messageCheck.rows[0].user_id;
    const messageText = messageCheck.rows[0].text;

    // Check if the like already exists for this user and message
    const likeCheck = await client.query(
      'SELECT 1 FROM message_likes WHERE user_id = $1 AND message_id = $2',
      [userId, messageId]
    );

    let isNewLike = false;
    let updateQuery = '';
    let likerName = 'Alguien';
    let messageSnippet = '';

    if (likeCheck.rowCount && likeCheck.rowCount > 0) {
      // LIKE EXISTS: Remove it and decrement count
      await client.query(
        'DELETE FROM message_likes WHERE user_id = $1 AND message_id = $2',
        [userId, messageId]
      );
      updateQuery = `
        WITH updated_message AS (
          UPDATE messages 
          SET likes = GREATEST(likes - 1, 0) 
          WHERE id = $1 
          RETURNING *
        )
        SELECT m.*, u.username, false AS is_liked_by_me
        FROM updated_message m
        LEFT JOIN users u ON m.user_id = u.id;
      `;
    } else {
      // LIKE NO EXISTS: Insert it and increment count
      await client.query(
        'INSERT INTO message_likes (user_id, message_id) VALUES ($1, $2)',
        [userId, messageId]
      );
      updateQuery = `
        WITH updated_message AS (
          UPDATE messages 
          SET likes = likes + 1 
          WHERE id = $1 
          RETURNING *
        )
        SELECT m.*, u.username, true AS is_liked_by_me
        FROM updated_message m
        LEFT JOIN users u ON m.user_id = u.id;
      `;
      isNewLike = true;

      // Obtener username de la persona que está dando el like
      const userCheck = await client.query('SELECT username FROM users WHERE id = $1', [userId]);
      if (userCheck.rowCount && userCheck.rowCount > 0) {
        likerName = userCheck.rows[0].username;
      }

      // Crear snippet de los primeros 30 caracteres
      messageSnippet = messageText.length > 30 ? messageText.substring(0, 30) + '...' : messageText;
    }

    const result = await client.query(updateQuery, [messageId]);
    const updatedMessage = result.rows[0];

    await client.query('COMMIT');

    // Broadcast like update event to all WebSocket clients
    broadcast('LIKE_UPDATED', updatedMessage);

    if (isNewLike && authorId !== userId) {
      // Broadcast notification event to the author of the message
      broadcast('NOTIFICATION', {
        type: 'NEW_LIKE',
        recipientId: authorId,
        likerName: likerName,
        messageSnippet: messageSnippet
      });
    }

    res.json(updatedMessage);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

import { Request, Response } from 'express';
import pool from '../config/db';
import { broadcast } from '../sockets/notifier';

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `
      SELECT m.*, u.username 
      FROM messages m 
      LEFT JOIN users u ON m.user_id = u.id 
      ORDER BY m.created_at DESC 
      LIMIT 50
    `;
    const result = await pool.query(query);
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
      SELECT m.*, u.username 
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
  try {
    const { id } = req.params;

    const query = `
      WITH updated_message AS (
        UPDATE messages 
        SET likes = likes + 1 
        WHERE id = $1 
        RETURNING *
      )
      SELECT m.*, u.username 
      FROM updated_message m
      LEFT JOIN users u ON m.user_id = u.id;
    `;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    const updatedMessage = result.rows[0];

    // Broadcast like update event to all WebSocket clients
    broadcast('LIKE_UPDATED', updatedMessage);

    res.json(updatedMessage);
  } catch (error) {
    console.error('Error liking message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

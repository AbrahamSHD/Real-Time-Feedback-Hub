import { Request, Response } from 'express';
import pool from '../config/db';

export const getRandomUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT id, username FROM users ORDER BY RANDOM() LIMIT 1');
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'No users found' });
            return;
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching random user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

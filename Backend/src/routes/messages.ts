import { Router } from 'express';
import { getMessages, createMessage, likeMessage } from '../controllers/messages';

const router = Router();

router.get('/', getMessages);
router.post('/', createMessage);
router.post('/:id/like', likeMessage);

export default router;

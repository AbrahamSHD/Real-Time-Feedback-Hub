import { Router } from 'express';
import { getRandomUser } from '../controllers/users';

const router = Router();

router.get('/random', getRandomUser);

export default router;

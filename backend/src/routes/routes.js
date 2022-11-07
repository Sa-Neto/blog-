import express from 'express';
import appRoutes from './appRoutes';
import userRoutes from './userRoutes';

const router = express.Router();

router.use('/', appRoutes);
router.use('/user', userRoutes);

export default router;

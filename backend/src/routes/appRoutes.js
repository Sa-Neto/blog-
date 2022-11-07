import express from 'express';
import appController from '../controller/appController';

const router = express.Router();

router.get('/', appController.app);

export default router;

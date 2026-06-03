import express from 'express';
import * as aiInsightsController from '../controllers/aiInsightsController.js';

const router = express.Router();

router.get('/:userId', aiInsightsController.getInsights);
router.post('/:userId/refresh', aiInsightsController.refreshInsights);

export default router;

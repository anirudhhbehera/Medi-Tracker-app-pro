import express from 'express';
import * as medicationController from '../controllers/medicationController.js';

const router = express.Router();

router.get('/', medicationController.getAllMedications);
router.get('/search', medicationController.searchMedications);
router.get('/low-stock', medicationController.getLowStockMedications);
router.get('/stats', medicationController.getMedicationStats);
router.get('/:id', medicationController.getMedicationById);
router.post('/', medicationController.createMedication);
router.put('/:id', medicationController.updateMedication);
router.delete('/:id', medicationController.deleteMedication);
router.patch('/:id/stock', medicationController.updateStock);

export default router;

import express from 'express';
import * as reminderController from '../controllers/reminderController.js';

const router = express.Router();

router.get('/', reminderController.getAllReminders);
router.get('/:id', reminderController.getReminderById);
router.post('/', reminderController.createReminder);
router.put('/:id', reminderController.updateReminder);
router.delete('/:id', reminderController.deleteReminder);
router.patch('/:id/toggle', reminderController.toggleReminder);
router.patch('/:id/taken', reminderController.markAsTaken);
router.patch('/:id/undo-taken', reminderController.undoTaken);

export default router;

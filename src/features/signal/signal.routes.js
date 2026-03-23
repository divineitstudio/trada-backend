import express from 'express';
import * as signalController from './signal.controller.js';

const router = express.Router();

router.get('/', signalController.getSignals);
router.get('/sender/:sender_id', signalController.getSignalbySender);
router.get('/my', signalController.getMySignals);
router.get('/:id', signalController.getSignalDetail);
router.post('/', signalController.createSignal);
router.put('/:id', signalController.updateSignal);
router.delete('/:id', signalController.deleteSignal);

export default router;
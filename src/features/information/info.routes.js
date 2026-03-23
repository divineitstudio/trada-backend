import express from 'express';
import * as infoController from './info.controller.js';

const router = express.Router();

router.get('/', infoController.getAllInfos);
router.get('/new', infoController.getNewInfos);
router.get('/:id', infoController.getInfoDetail);
router.post('/', infoController.createInfo);
router.put('/:id', infoController.updateInfo);
router.delete('/:id', infoController.deleteInfo);

export default router;
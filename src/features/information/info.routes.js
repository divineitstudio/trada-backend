import express from 'express';
import * as infoController from './info.controller.js';

const router = express.Router();

router.get('/', infoController.getInfos);
router.get('/:id', infoController.getInfoDetail);
router.post('/', infoController.createInfo);

export default router;
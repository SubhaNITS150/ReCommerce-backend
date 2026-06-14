import express from 'express';
import validate from '../../middlewares/validate';
import itemValidation from '../../validations/item.validation';
import itemController from '../../controllers/item.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create', auth(), validate(itemValidation.createItem), itemController.createItem);

export default router;
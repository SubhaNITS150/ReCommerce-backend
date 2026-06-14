import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import itemService from '../services/item.service';
import { User } from '@prisma/client';

const createItem = catchAsync(async (req, res) => {
  const ownerId = (req.user as User).id;
  const itemData = { ...req.body, ownerId };
  const item = await itemService.createItem(itemData);
  res.status(httpStatus.CREATED).send(item);
});

export default {
  createItem
};
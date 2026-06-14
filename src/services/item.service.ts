import { Item, Prisma } from '@prisma/client';
import prisma from '../client';
import { CreateItemInput } from '../types/item.types';


const createItem = async (itemBody: CreateItemInput): Promise<Item> => {
  const { images, ...coreItemData } = itemBody;

  return prisma.item.create({
    data: {
      ...coreItemData,
      images: images && images.length > 0 ? {
        createMany: {
          data: images
        }
      } : undefined
    },
    include: {
      images: true,
      category: true
    }
  });
};

export default {
  createItem
};
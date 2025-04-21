import { Router } from 'express';
import { delItem, getAllItems, postItem, putItem, updatePartiallyItem } from '../controllers/item';

const itemRouter = Router();

itemRouter.get('/', getAllItems);
itemRouter.post('/', postItem);
itemRouter.delete('/:id', delItem);
itemRouter.put('/:id', putItem);
itemRouter.patch('/:id', updatePartiallyItem);

export { itemRouter };

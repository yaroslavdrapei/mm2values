import { Router } from 'express';
import { ItemController } from '../controllers/item.controller';

const itemController = new ItemController();
const itemRouter = Router();

itemRouter.get('/', itemController.getItems);
itemRouter.get('/:id', itemController.getItemById);
itemRouter.post('/', itemController.createItem);
itemRouter.delete('/:id', itemController.deleteItem);
itemRouter.put('/:id', itemController.updateItem);
itemRouter.patch('/:id', itemController.patchItem);

export { itemRouter };

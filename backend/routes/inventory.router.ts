import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';

const inventoryRouter = Router();
const inventoryController = new InventoryController();

inventoryRouter.get('/:id', inventoryController.getInventoryById);
inventoryRouter.get('/:id/value', inventoryController.getInventoryValue);
inventoryRouter.post('/recalculate', inventoryController.recalculateValue);
inventoryRouter.post('/', inventoryController.createInventory);
inventoryRouter.delete('/:id', inventoryController.deleteInventory);
inventoryRouter.patch('/:id', inventoryController.patchInventory);
inventoryRouter.post('/:id/items', inventoryController.addItemToInventory);
inventoryRouter.patch('/:id/items/:itemId', inventoryController.changeInventoryItem);

export { inventoryRouter };

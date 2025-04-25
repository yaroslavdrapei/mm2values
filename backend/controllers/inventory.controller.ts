import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';
import { IInventory } from '../../shared/types/types';

export class InventoryController {
  public inventoryService = new InventoryService();

  public getInventoryById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const inventory = await this.inventoryService.getInventoryById(id);
      if (!inventory) {
        res.sendStatus(404);
        return;
      }
      res.status(200).json(inventory);
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  };

  public getInventoryValue = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const result = await this.inventoryService.getInventoryValue(id);
      if (!result) {
        res.sendStatus(404);
        return;
      }
      res.status(200).json(result);
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  };

  public createInventory = async (req: Request, res: Response): Promise<void> => {
    const chatId = req?.body?.chatId;

    if (!chatId) {
      res.sendStatus(400);
      return;
    }

    try {
      const inventory = await this.inventoryService.createInventory(chatId);
      if (!inventory) {
        res.sendStatus(404);
        return;
      }
      res.status(201).json(inventory);
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  };

  public deleteInventory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const result = await this.inventoryService.deleteInventory(id);
      if (!result) {
        res.sendStatus(404);
        return;
      }
      res.sendStatus(204);
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  };

  public patchInventory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const body = req.body as Partial<IInventory>;

    try {
      const result = await this.inventoryService.patchInventory(id, body);
      if (!result) {
        res.sendStatus(404);
        return;
      }
      res.sendStatus(204);
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  };

  public addItemToInventory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const body = req.body;
    try {
      const inventory = await this.inventoryService.addItemToInventory(id, body);
      if (!inventory) {
        res.sendStatus(404);
        return;
      }
      res.sendStatus(204);
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  };

  public changeInventoryItem = async (req: Request, res: Response): Promise<void> => {
    const { id, itemId } = req.params;
    const body = req.body;
    try {
      const inventory = await this.inventoryService.changeInventoryItem(id, itemId, body);
      if (!inventory) {
        res.sendStatus(404);
        return;
      }
      res.sendStatus(204);
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  };

  public recalculateValue = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.inventoryService.recalculateValue();
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  };
}

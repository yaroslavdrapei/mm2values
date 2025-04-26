import { Request, Response } from 'express';
import { ItemService } from '../services/item.service';

export class ItemController {
  public itemService = new ItemService();

  public getItems = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as Record<string, string>;
    const items = await this.itemService.getItems(query);
    res.status(200).json(items);
  };

  public getItemById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
      const item = await this.itemService.getItemById(id);
      if (!item) {
        res.sendStatus(404);
        return;
      }
      res.status(200).json(item);
    } catch {
      res.sendStatus(400);
    }
  };

  public createItem = async (req: Request, res: Response): Promise<void> => {
    const body = req.body;
    try {
      await this.itemService.createItem(body);
      res.sendStatus(201);
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  };

  public updateItem = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const body = req.body;

    try {
      await this.itemService.updateItem(id, body);
      res.sendStatus(204);
    } catch {
      res.sendStatus(400);
    }
  };

  public deleteItem = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      await this.itemService.deleteItem(id);
      res.sendStatus(204);
    } catch {
      res.sendStatus(400);
    }
  };

  public patchItem = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const body = req.body;
    try {
      await this.itemService.patchItem(id, body);
      res.sendStatus(204);
    } catch {
      res.sendStatus(400);
    }
  };
}

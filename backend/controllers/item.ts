import { Request, Response } from 'express';
import { createItem, deleteItem, getItems, patchItem, updateItem } from '../services/item';

export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  const items = await getItems();
  res.status(200).json(items);
};

export const postItem = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;
  try {
    await createItem(body);
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};

export const putItem = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const body = req.body;

  try {
    await updateItem(id, body);
    res.sendStatus(204);
  } catch {
    res.sendStatus(400);
  }
};

export const delItem = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    await deleteItem(id);
    res.sendStatus(204);
  } catch {
    res.sendStatus(400);
  }
};

export const updatePartiallyItem = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const body = req.body;
  try {
    await patchItem(id, body);
    res.sendStatus(204);
  } catch {
    res.sendStatus(400);
  }
};

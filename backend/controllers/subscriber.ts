import { Request, Response } from 'express';
import { createSubscriber, deleteSubscriber, getSubscriberByChatId, getSubscribers } from '../services/subscriber';

export const getAllSubscribers = async (req: Request, res: Response): Promise<void> => {
  const subscribers = await getSubscribers();
  res.status(200).json(subscribers);
};

export const getSubscriber = async (req: Request, res: Response): Promise<void> => {
  const chatId = parseInt(req.params.chatId);
  const subscriber = await getSubscriberByChatId(chatId);
  if (!subscriber) {
    res.sendStatus(404);
    return;
  }
  res.status(200).json(subscriber);
};

export const postSubscriber = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;

  try {
    await createSubscriber(body);
    res.sendStatus(201);
  } catch {
    res.sendStatus(400);
  }
};

export const delSubscriber = async (req: Request, res: Response): Promise<void> => {
  const chatId = parseInt(req.params['chatId']);

  try {
    await deleteSubscriber(chatId);
    res.sendStatus(204);
  } catch {
    res.sendStatus(400);
  }
};

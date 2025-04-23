import { Request, Response } from 'express';
import { SubscriberService } from '../services/subscriber-service';

export class SubscriberController {
  public subscriberService = new SubscriberService();

  public getAllSubscribers = async (req: Request, res: Response): Promise<void> => {
    const subscribers = await this.subscriberService.getSubscribers();
    res.status(200).json(subscribers);
  };

  public getSubscriber = async (req: Request, res: Response): Promise<void> => {
    const chatId = parseInt(req.params.chatId);
    const subscriber = await this.subscriberService.getSubscriberByChatId(chatId);
    if (!subscriber) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(subscriber);
  };

  public createSubscriber = async (req: Request, res: Response): Promise<void> => {
    const body = req.body;

    try {
      await this.subscriberService.createSubscriber(body);
      res.sendStatus(201);
    } catch {
      res.sendStatus(400);
    }
  };

  public deleleSubscriber = async (req: Request, res: Response): Promise<void> => {
    const chatId = parseInt(req.params['chatId']);

    try {
      await this.subscriberService.deleteSubscriber(chatId);
      res.sendStatus(204);
    } catch {
      res.sendStatus(400);
    }
  };
}

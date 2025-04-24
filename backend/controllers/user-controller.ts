import { Request, Response } from 'express';
import { UserService } from '../services/user-service';

export class UserController {
  public userService = new UserService();

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getUsers();
    res.status(200).json(users);
  };

  public getUser = async (req: Request, res: Response): Promise<void> => {
    const chatId = parseInt(req.params.chatId);
    const user = await this.userService.getUserByChatId(chatId);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(user);
  };

  public createUser = async (req: Request, res: Response): Promise<void> => {
    const body = req.body;

    try {
      await this.userService.createUser(body);
      res.sendStatus(201);
    } catch {
      res.sendStatus(400);
    }
  };

  public deleleUser = async (req: Request, res: Response): Promise<void> => {
    const chatId = parseInt(req.params['chatId']);

    try {
      await this.userService.deleteUser(chatId);
      res.sendStatus(204);
    } catch {
      res.sendStatus(400);
    }
  };

  public patchUser = async (req: Request, res: Response): Promise<void> => {
    const chatId = parseInt(req.params.chatId);
    const body = req.body;

    try {
      await this.userService.patchUser(chatId, body);
      res.sendStatus(204);
    } catch {
      res.sendStatus(400);
    }
  };
}

import { User } from '../schemas/user';
import { IUser } from '../../shared/types/types';

export class UserService {
  public getUsers = async (): Promise<IUser[]> => {
    return await User.find();
  };

  public getUserByChatId = async (chatId: number): Promise<IUser | null> => {
    return await User.findOne({ chatId });
  };

  public getUserByUsername = async (username: string): Promise<IUser | null> => {
    return await User.findOne({ username });
  };

  public createUser = async (user: IUser): Promise<boolean> => {
    const result = await User.create(user);
    return !!result;
  };

  public deleteUser = async (chatId: number): Promise<boolean> => {
    const result = await User.deleteOne({ chatId });
    return result.deletedCount > 0;
  };
}

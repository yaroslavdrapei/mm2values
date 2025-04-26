import { User } from '../schemas/user.schema';
import { IUser } from '../../shared/types/types';

export class UserService {
  public getUsers = async (): Promise<IUser[]> => {
    return await User.find();
  };

  public getUserByChatId = async (chatId: number): Promise<IUser | null> => {
    return await User.findOne({ chatId });
  };

  public createUser = async (user: IUser): Promise<boolean> => {
    const result = await User.create(user);
    return !!result;
  };

  public deleteUser = async (chatId: number): Promise<boolean> => {
    const result = await User.deleteOne({ chatId });
    return result.deletedCount > 0;
  };

  public patchUser = async (chatId: number, newUserProps: Partial<IUser>): Promise<boolean> => {
    const user = await User.findOne({ chatId });
    if (!user) return false;

    for (const key of Object.keys(newUserProps)) {
      if (!user.schema.path(key)) continue;
      user.set(key, newUserProps[key] ?? user.get(key));
    }

    // Object.assign(user, newUserProps); // not safe yet

    await user.save();
    return true;
  };
}

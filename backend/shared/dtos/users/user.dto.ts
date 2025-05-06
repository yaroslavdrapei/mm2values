import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  chatId: number;

  @Expose()
  username: string;

  @Expose()
  subscribed: boolean;
}

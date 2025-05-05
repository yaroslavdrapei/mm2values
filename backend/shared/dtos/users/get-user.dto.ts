import { transformToBoolean } from '@shared/utils/transformToBoolean';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  chatId?: number;

  @IsBoolean()
  @Transform(({ value }) => transformToBoolean(value))
  @IsOptional()
  subscribed?: boolean;
}

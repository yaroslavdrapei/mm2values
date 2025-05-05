import { IsNumber } from 'class-validator';

export class ChangeQuantityDto {
  @IsNumber()
  quantity: number;
}

import { Expose, Transform, Type } from 'class-transformer';
import { SubItemDto } from './subitem.dto';

export class InventoryDto {
  @Expose()
  id: string;

  @Expose()
  @Transform(({ obj }) => obj.user)
  userId: string;

  @Expose()
  @Type(() => SubItemDto)
  items: SubItemDto[];

  @Expose()
  currentValue: number;

  @Expose()
  lastValue: number;
}

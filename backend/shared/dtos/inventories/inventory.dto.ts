import { Expose, Transform, Type } from 'class-transformer';
import { InventoryItem } from './inventory-item.dto';

export class InventoryDto {
  @Expose()
  id: string;

  @Expose()
  @Transform(({ obj }) => obj.user)
  userId: string;

  @Expose()
  @Type(() => InventoryItem)
  items: InventoryItem[];

  @Expose()
  currentValue: number;

  @Expose()
  lastValue: number;
}

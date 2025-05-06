import { Expose, Type } from 'class-transformer';
import { ItemDto } from '../../../shared/dtos/items/item.dto';

export class SubItemDto {
  @Expose()
  @Type(() => ItemDto)
  item: ItemDto;

  @Expose()
  quantity: number;
}

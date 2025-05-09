import { Expose } from 'class-transformer';

export class ItemDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  value: string;

  @Expose()
  stability: string;

  @Expose()
  demand: string;

  @Expose()
  rarity: string;

  @Expose()
  type: string;

  @Expose()
  origin: string;

  @Expose()
  rangedValue: string;

  @Expose()
  lastChangeInValue: string;

  @Expose()
  class: string;

  @Expose()
  contains: string;

  @Expose()
  category: string;
}

import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class AddItemDto {
  @IsMongoId()
  itemId: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;
}

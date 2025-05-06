import { IsMongoId } from 'class-validator';

export class CreateInventoryDto {
  @IsMongoId()
  userId: string;
}

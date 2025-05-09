import { IsMongoId } from 'class-validator';

export class CreateApikeyDto {
  @IsMongoId()
  userId: string;
}

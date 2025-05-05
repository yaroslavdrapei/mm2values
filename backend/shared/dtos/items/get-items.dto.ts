import { IsOptional, IsString } from 'class-validator';

export class GetItemsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  origin?: string;
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  stability: string;

  @IsString()
  @IsNotEmpty()
  demand: string;

  @IsString()
  @IsNotEmpty()
  rarity: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  origin: string;

  @IsString()
  @IsOptional()
  rangedValue: string;

  @IsString()
  @IsOptional()
  lastChangeInValue: string;

  @IsString()
  @IsOptional()
  class: string;

  @IsString()
  @IsOptional()
  contains: string;

  @IsString()
  @IsOptional()
  category: string;
}

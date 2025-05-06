import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateItemDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  value?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  stability?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  demand?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  rarity?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  origin?: string;

  @IsString()
  @IsOptional()
  rangedValue?: string;

  @IsString()
  @IsOptional()
  lastChangeInValue?: string;

  @IsString()
  @IsOptional()
  class?: string;

  @IsString()
  @IsOptional()
  contains?: string;
}

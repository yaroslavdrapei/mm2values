import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  @IsJSON()
  report: string;
}

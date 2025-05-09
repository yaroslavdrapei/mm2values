import { Expose } from 'class-transformer';

export class ReportDto {
  @Expose()
  report: string;

  @Expose()
  createdAt: Date;
}

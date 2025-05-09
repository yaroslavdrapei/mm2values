import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from '@shared/schemas/report.schema';
import { ApikeysModule } from 'src/apikeys/apikeys.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]), ApikeysModule],
  providers: [ReportsService],
  controllers: [ReportsController]
})
export class ReportsModule {}

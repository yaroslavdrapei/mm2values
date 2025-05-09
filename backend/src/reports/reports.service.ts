import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateReportDto } from '@shared/dtos/reports/create-report.dto';
import { Report } from '@shared/schemas/report.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}

  async findAll() {
    return await this.reportModel.find();
  }

  async findOne(id: string) {
    return await this.reportModel.findOne({ _id: id });
  }

  async findLatest() {
    return (await this.reportModel.find().sort({ createdAt: 1 })).at(-1);
  }

  async create({ report }: CreateReportDto) {
    return await this.reportModel.create({ report });
  }

  async delete(id: string) {
    const report = await this.findOne(id);
    if (!report) return null;

    await this.reportModel.deleteOne({ _id: id });
    return report;
  }
}

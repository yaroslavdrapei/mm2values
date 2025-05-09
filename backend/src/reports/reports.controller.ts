import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ParseObjectIdPipe } from '@shared/pipes/parse-object-id.pipe';
import { Serialize } from '@shared/interceptors/serialize.interceptor';
import { ReportDto } from '@shared/dtos/reports/report.dto';
import { ApikeyGuard } from '@shared/guards/apikey.guard';
import { CreateReportDto } from '@shared/dtos/reports/create-report.dto';

@Controller('reports')
@Serialize(ReportDto)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  async findAll() {
    return await this.reportsService.findAll();
  }

  @Get('/latest')
  async findLatest() {
    return await this.reportsService.findLatest();
  }

  @Get('/:id')
  async findById(@Param('id', ParseObjectIdPipe) id: string) {
    const report = await this.reportsService.findOne(id);
    if (!report) {
      throw new NotFoundException('Report with this id was not found');
    }
    return report;
  }

  @UseGuards(ApikeyGuard)
  @Post()
  async create(@Body() body: CreateReportDto) {
    return await this.reportsService.create(body);
  }

  @UseGuards(ApikeyGuard)
  @Delete()
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    const report = await this.reportsService.delete(id);
    if (!report) {
      throw new NotFoundException('Report with this id was not found');
    }
    return report;
  }
}

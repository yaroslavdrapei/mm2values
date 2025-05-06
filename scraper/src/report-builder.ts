import { Report, ReportRecord } from './types';

export class ReportBuilder {
  private report: Report = {};

  public constructor() {}

  public addOrModifyRecord(name: string, property: string, oldValue?: string, newValue?: string): void {
    const newRecord: ReportRecord = { [property]: { old: oldValue ?? '', new: newValue ?? '' } };

    if (name in this.report) {
      this.report[name] = { ...this.report[name], ...newRecord };
    } else {
      this.report[name] = newRecord;
    }
  }

  public getReport(): Report {
    return this.report;
  }

  public isEmpty(): boolean {
    return Object.keys(this.report).length == 0;
  }
}

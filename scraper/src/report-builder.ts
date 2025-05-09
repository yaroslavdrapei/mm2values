import { ItemType, Report, ReportRecord } from './types';

export class ReportBuilder {
  private report: Report = {};

  public constructor() {}

  public addOrModifyRecord(name: string, type: ItemType, property: string, oldValue?: string, newValue?: string): void {
    const newRecord: ReportRecord = { [property]: { old: oldValue ?? '', new: newValue ?? '' } };

    if (type in this.report) {
      const category = this.report[type]!;
      if (name in category) {
        category[name] = { ...category[name], ...newRecord };
      } else {
        category[name] = newRecord;
      }
      return;
    }

    this.report[type] = { [name]: newRecord };
  }

  public getReport(): Report {
    return this.report;
  }

  public isEmpty(): boolean {
    return Object.keys(this.report).length == 0;
  }
}

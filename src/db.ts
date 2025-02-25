import path from 'path';
import fs from 'fs';
import { DbSchema, ISubscriber } from './types/types';

export class Db {
  private db = path.resolve('db.json');
  public constructor() {
    if (!fs.existsSync(this.db)) {
      fs.writeFileSync(this.db, JSON.stringify({ data: '', subscribers: '[]' }));
    }
  }

  public getData(): string {
    const data: DbSchema = JSON.parse(fs.readFileSync(this.db, 'utf8'));
    return data.data;
  }

  public getSubscribers(): ISubscriber[] {
    const data: DbSchema = JSON.parse(fs.readFileSync(this.db, 'utf8'));
    return JSON.parse(data.subscribers);
  }

  public setData(data: string): void {
    const db: DbSchema = JSON.parse(fs.readFileSync(this.db, 'utf8'));
    db.data = data;
    fs.writeFileSync(this.db, JSON.stringify(db));
  }

  public setSubscribers(subscribers: ISubscriber[]): void {
    const db: DbSchema = JSON.parse(fs.readFileSync(this.db, 'utf8'));
    db.subscribers = JSON.stringify(subscribers);
    fs.writeFileSync(this.db, JSON.stringify(db));
  }
}

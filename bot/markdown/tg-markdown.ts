import { IMarkdown, MarkdownType } from '../../shared/types/types';

export class TgMarkdown implements IMarkdown {
  public type: MarkdownType = 'MarkdownV2';

  public escape(str: string): string {
    return str.replace(/[_*[\]()~`#+\-={}|.!]/g, '\\$&');
  }

  public bold(str: string): string {
    return `*${this.escape(str)}*`;
  }

  public italic(str: string): string {
    return `_${this.escape(str)}_`;
  }

  public underline(str: string): string {
    return `__${this.escape(str)}__`;
  }
}

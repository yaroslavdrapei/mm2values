import { IMarkdown, MarkdownType } from '.././types';

export class HtmlMarkdown implements IMarkdown {
  public type: MarkdownType = 'HTML';

  public escape(str: string): string {
    return str.replace(/[<>&"]/g, (char) => {
      switch (char) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case '"':
          return '&quot;';
        default:
          return char;
      }
    });
  }

  public bold(str: string): string {
    return `<b>${this.escape(str)}</b>`;
  }

  public italic(str: string): string {
    return `<i>${this.escape(str)}</i>`;
  }

  public underline(str: string): string {
    return `<u>${this.escape(str)}</u>`;
  }
}

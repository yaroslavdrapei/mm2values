import { IMarkdown, MarkdownType } from '../../shared/types/types';
import { HtmlMarkdown } from './html-markdown';
import { TgMarkdown } from './tg-markdown';

export class MarkdownFactory {
  public static create(markdownType: MarkdownType): IMarkdown {
    switch (markdownType) {
      case 'HTML':
        return new HtmlMarkdown();
      case 'MarkdownV2':
        return new TgMarkdown();
      default:
        console.log(`Incorrect markdown type: ${markdownType}; Used html as default`);
        return new HtmlMarkdown();
    }
  }
}

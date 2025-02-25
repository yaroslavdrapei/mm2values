import { JSDOM } from 'jsdom';
import { IDataFetcher } from './types/types';

export class HtmlScraper implements IDataFetcher {
  public constructor(private readonly url: string) {}

  public async getData(): Promise<string> {
    const response = await fetch(this.url);
    const html = await response.text();

    const document = new JSDOM(html).window.document;
    const data = document.querySelectorAll('.footertext')[0]?.textContent;

    if (!data) {
      throw new Error('Failed to make a jsdom query');
    }

    return this.prettifyData(data);
  }

  private prettifyData(data: string): string {
    const rows = data.split('\n');

    for (let i = 0; i < rows.length; i++) {
      if (rows[i] == 'N/A') {
        rows.splice(i - 1, 3);
        i -= 2;
        continue;
      }

      rows[i] = rows[i].trim();
    }

    return rows.join('\n');
  }
}

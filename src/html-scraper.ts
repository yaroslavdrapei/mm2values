import { JSDOM } from 'jsdom';

export class HtmlScraper {
  public constructor(private readonly url: string) {}

  public async getData(): Promise<string> {
    const response = await fetch(this.url);
    const html = await response.text();

    const document = new JSDOM(html).window.document;
    const data = document.querySelectorAll('.footertext')[0]?.textContent;

    if (!data) {
      throw new Error('No data found, check the source and the html structure');
    }

    return this.prettifyData(data);
  }

  private prettifyData(data: string): string {
    console.log('Raw data:\n', data);
    const rows = data.split('\n');
    console.log('Rows:\n', rows);

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

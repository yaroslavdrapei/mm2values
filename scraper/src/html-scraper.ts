import { JSDOM } from 'jsdom';
import { IHtmlScraper, Item, isItem } from './types';
export class HtmlScraper implements IHtmlScraper {
  private baseUrl: string = process.env.BASE_URL!;
  public itemCount: number = 0; // just statistics
  private pages: string[] = [
    'misc',
    'sets',
    'uniques',
    'pets',
    'ancients',
    'vintages',
    'chromas',
    'godlies',
    'legendaries',
    'rares',
    'uncommons',
    'commons'
  ];

  public async getChangeLog(): Promise<string | null> {
    let html: string;

    try {
      const response = await fetch(`${this.baseUrl}/index.html`);
      html = await response.text();
    } catch (e) {
      console.log(e);
      return null;
    }

    const document = new JSDOM(html).window.document;
    const data = document.querySelectorAll('.footertext')[0]?.textContent;

    if (!data) {
      console.log('Failed to make a jsdom query');
      return null;
    }

    return this.prettifyData(data);
  }

  public async getItems(): Promise<Item[] | null> {
    const promises: Promise<Item[]>[] = [];

    for (const page of this.pages) {
      promises.push(this.getItemsFromPage(page));
    }

    try {
      const items = (await Promise.all(promises)).flat();
      console.log(`Total potential items: ${this.itemCount}`);
      console.log(`Total valid items: ${items.length}`);
      return items;
    } catch (e) {
      console.log(`Error while trying to get items:\n${e}`);
      return null;
    }
  }

  public async getItemsFromPage(page: string): Promise<Item[]> {
    const url = `${this.baseUrl}/${page}.html`;

    const response = await fetch(url);
    const html = await response.text();

    const document = new JSDOM(html).window.document;
    const items = document.querySelectorAll('.itemcolumn');

    if (!items) {
      throw new Error('Failed to make a jsdom query');
    }

    this.itemCount += items.length;

    const result: Item[] = [];

    items.forEach((potentialItem) => {
      const otherProps = this.getOtherProps(potentialItem);
      const demandAndRarity = this.getDemandRarity(potentialItem);

      if (!(otherProps && demandAndRarity)) return;

      const item = { ...otherProps, ...demandAndRarity, type: page };

      if (isItem(item)) {
        result.push(item);
      }
    });

    return result;
  }

  private getOtherProps(elem: Element): Record<string, string> | null {
    const result: Record<string, string> = {};
    const matrixOfItems: string[][] = elem
      .textContent!.split('\n')
      .map((x) => x.trim())
      .filter((y) => y != '')
      .map((z) => z.split(' - '));

    matrixOfItems.forEach((potentialItem) => {
      if (potentialItem.length == 1) {
        result['name'] = potentialItem[0];
        return;
      }

      if (potentialItem[0].toLowerCase() == 'ranged value') {
        if (potentialItem.length == 3) {
          result['rangedValue'] = `${potentialItem[1]} - ${potentialItem[2]}`;
        } else {
          result['rangedValue'] = potentialItem[1];
        }
        return;
      }

      if (potentialItem[0].toLowerCase() == 'last change in value') {
        result['lastChangeInValue'] = potentialItem[1].replace(/[()]/g, '');
        return;
      }

      if (potentialItem.length == 3) return;

      if (potentialItem[0].toLowerCase() == 'value') {
        const particles = potentialItem[1].split(' ');
        if (!isNaN(parseInt(particles[0]))) {
          result['value'] = particles[0];
          return;
        }
        result['value'] = potentialItem[1];
      }

      result[potentialItem[0].toLowerCase()] = potentialItem[1];
    });

    return result;
  }

  private getDemandRarity(elem: Element): { demand: string; rarity: string } | null {
    const sep = elem.querySelector('sep');

    if (!sep || !sep.previousElementSibling) return null;
    return {
      demand: sep.previousElementSibling.textContent!,
      rarity: sep.childNodes[1].textContent! || sep.childNodes[0].textContent!.split(' - ')[1]
    };
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

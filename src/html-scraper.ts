import { JSDOM } from 'jsdom';
import { DefaultObject, IDataFetcher, IItem, isIItem } from './types/types';

export class HtmlScraper implements IDataFetcher {
  private baseUrl: string = process.env.BASE_SOURCE!;
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

  public async getItems(): Promise<IItem[]> {
    const promises: Promise<IItem[]>[] = [];

    for (const page of this.pages) {
      promises.push(this.getItemsFromPage(page));
    }

    try {
      const items = (await Promise.all(promises)).flat();
      console.log(`Total potential items: ${this.itemCount}`);
      console.log(`Total valid items: ${items.length}`);
      return items;
    } catch (e) {
      console.log(`Error while trying to get items`);
      throw e;
    }
  }

  public async getItemsFromPage(page: string): Promise<IItem[]> {
    const url = `${this.baseUrl}/${page}.html`;

    const response = await fetch(url);
    const html = await response.text();

    const document = new JSDOM(html).window.document;
    const items = document.querySelectorAll('.itemcolumn');

    if (!items) {
      throw new Error('Failed to make a jsdom query');
    }

    this.itemCount += items.length;

    const result: IItem[] = [];

    items.forEach((potentialItem) => {
      const otherProps = this.getOtherProps(potentialItem);
      const demandAndRarity = this.getDemandRarity(potentialItem);

      if (!(otherProps && demandAndRarity)) return;

      const item = { ...otherProps, ...demandAndRarity };

      if (isIItem(item)) {
        result.push(item);
      }
    });

    console.log(`Total on ${page}: ${items.length}`);
    console.log(`Valid on ${page}: ${result.length}`);

    return result;
  }

  private getOtherProps(elem: Element): DefaultObject | null {
    const result: DefaultObject = {};
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
        result['ranged value'] = `${potentialItem[1]} - ${potentialItem[2]}`;
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

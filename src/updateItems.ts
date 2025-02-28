import { HtmlScraper } from './html-scraper';
import { Item } from './schemas/Items';

export const updateItems = async (): Promise<boolean> => {
  console.log('Initiazing db update');
  const htmlScraper = new HtmlScraper(process.env.SOURCE!);
  const newItems = await htmlScraper.getItems();

  const deleteResult = await Item.deleteMany({ name: { $exists: true } });
  console.log(deleteResult);

  const promises = newItems.map((item) => {
    return Item.create(item);
  });

  await Promise.all(promises);
  console.log(`New items ${newItems.length} added`);

  return false;
};

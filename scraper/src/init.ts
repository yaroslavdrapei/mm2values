import dotenv from 'dotenv';
dotenv.config();
import { HtmlScraper } from './html-scraper';
import axios from 'axios';
import { Item } from './types';

const API_URL = process.env.API_URL!;

export const init = async (): Promise<void> => {
  // delete all items
  const response = await axios.get(`${API_URL}/items`);
  const oldItems = response.data as Item[];

  oldItems.forEach(async (item) => {
    const result = await axios.delete(`${API_URL}/items/${item.id}`);
    console.log(`${item.name}: ${result.status} ${result.statusText}`);
  });

  // add items back
  const htmlScraper = new HtmlScraper();
  const items = await htmlScraper.getItems();

  if (!items) return;

  items.forEach(async (item) => {
    const result = await axios.post(`${API_URL}/items`, item);
    console.log(`${item.name}: ${result.status} ${result.statusText}`);
  });
};

init();

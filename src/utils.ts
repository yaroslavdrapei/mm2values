import { IItem } from './types/types';

export const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const capitalize = (str: string): string => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const itemToText = (item: IItem): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const smth = (item as any)._doc;

  const information = Object.entries(smth)
    .filter((pair) => pair[0][0] != '_' || pair[0] == 'name')
    .map((pair) => `${pair[0][0].toUpperCase()}${pair[0].slice(1)}: ${pair[1]}`)
    .join('\n');

  return `${capitalize(item.name)}\n${information}`;
};

export const removeCommandForMessage = (str: string): string => {
  // removing the /<whatever command> command from upfront
  return str.split(' ').slice(1).join(' ');
};

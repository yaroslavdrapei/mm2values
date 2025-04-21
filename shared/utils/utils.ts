import { IItem, IMarkdown, Report } from '../types/types';

export const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const capitalize = (str: string): string => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const itemToText = (item: IItem, markdown: IMarkdown): string => {
  const information = Object.entries(item)
    .filter((pair) => pair[0][0] != '_' && pair[0] != 'name') // skipping name property
    .map((pair) => `${pair[0][0].toUpperCase()}${pair[0].slice(1)}: ${markdown.bold(capitalize(pair[1]))}`) // prettify the output
    .join('\n');

  const name = markdown.bold(capitalize(item.name));

  return `${name}\n${information}`;
};

export const removeCommandFromMessage = (str: string): string => {
  // removing the /<whatever command> command from upfront
  return str.split(' ').slice(1).join(' ');
};

export const reportToUpdateLog = (report: Report, markdown: IMarkdown): string => {
  const title = markdown.bold('Most recent update log:\n');
  const message: string[] = [title];

  for (const name of Object.keys(report) as (keyof Report)[]) {
    const nameOfItem = markdown.bold(capitalize(name as string));
    message.push(nameOfItem);

    const changes = report[name];
    for (const [property, change] of Object.entries(changes)) {
      message.push(`${capitalize(property)}: ${markdown.bold(change.old)} -> ${markdown.bold(change.new)}`);
    }

    message.push('');
  }

  return message.join('\n');
};

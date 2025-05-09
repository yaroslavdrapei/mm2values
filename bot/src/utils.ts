import { Item, IMarkdown, TgItemRequest, UpdateLog, ItemType } from './types';

export const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const capitalize = (str: string): string => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const itemToText = (item: Item, markdown: IMarkdown): string => {
  const excludedProperties = ['name', 'id'];
  const information = Object.entries(item)
    .filter(([property]) => !excludedProperties.includes(property))
    .map(([property, value]) => `${property[0].toUpperCase()}${property.slice(1)}: ${markdown.bold(capitalize(value))}`) // prettify the output
    .join('\n');

  const name = markdown.bold(capitalize(item.name));

  return `${name}\n${information}`;
};

export const removeCommandFromMessage = (str: string): string => {
  // removing the /<whatever command> command from upfront
  return str.split(' ').slice(1).join(' ');
};

export const reportToUpdateLog = ({ report, createdAt }: UpdateLog, markdown: IMarkdown): string => {
  const title = markdown.bold(`Most recent update log (${new Date(createdAt).toLocaleDateString('en-GB')}):\n`);
  const message: string[] = [title];

  for (const type of Object.keys(report)) {
    message.push(markdown.bold(`---------------- ${capitalize(type)} ----------------\n`));

    const category = report[type as ItemType]!;
    for (const name of Object.keys(category)) {
      const nameOfItem = markdown.bold(capitalize(name as string));
      message.push(nameOfItem);

      const changes = category[name];
      for (const [property, change] of Object.entries(changes)) {
        message.push(`${capitalize(property)}: ${markdown.bold(change.old)} -> ${markdown.bold(change.new)}`);
      }

      message.push('');
    }
  }

  return message.join('\n');
};

export const queryBuilder = (
  name: string | undefined,
  type: string | undefined,
  origin: string | undefined
): string => {
  const query: string[] = ['?'];

  if (name) query.push(`name=${name}&`);
  if (type) query.push(`type=${type}&`);
  if (origin) query.push(`origin=${origin}&`);

  return query.join('').slice(0, query.join('').length - 1);
};

export const extractUserRequest = (request: string): TgItemRequest => {
  const splitted = request.split(' ');

  if (splitted.length == 1) {
    return { quantity: 1, name: splitted[0] };
  }

  const quantity = parseInt(splitted[splitted.length - 1]);

  if (isNaN(quantity)) {
    return { quantity: 1, name: splitted.join(' ') };
  }

  return { quantity, name: splitted.slice(0, splitted.length - 1).join(' ') };
};

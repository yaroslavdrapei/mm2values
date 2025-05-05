import { escapeRegex } from './escapeRegex';

export function valuesToRegex(obj: Record<string, string>): Record<string, RegExp> {
  const values = Object.values(obj);
  const regexes = values.map((v) => new RegExp(`^${escapeRegex(v)}$`, 'i'));

  const result: Record<string, RegExp> = {};

  Object.keys(obj).map((key, i) => {
    result[key] = regexes[i];
  });

  return result;
}

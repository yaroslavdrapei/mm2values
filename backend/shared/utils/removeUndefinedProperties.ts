export function removeUndefinedProperties(obj: object): object {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}

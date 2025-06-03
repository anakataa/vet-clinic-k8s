/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { camelCase, isPlainObject, isArray } from "lodash";

export function toCamelCase(obj: any): any {
  if (isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (isPlainObject(obj)) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = camelCase(key);
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

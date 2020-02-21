import { trimEnd as trimmer } from 'lodash';

export const trimEnd = trimmer;

// Replace any sequence of whitespace characters with single whitespace
export const equalizeWhitespace = (st: string): string => {
  return st.replace(/\s+/g, ' ');
};

export const addWhitespace = (st: string, pre: boolean = false): string => {
  if (pre) {
    return equalizeWhitespace(' ' + st);
  }

  return equalizeWhitespace(st + ' ');
};

export const removeWhitespace = (st: string): string => {
  return st.replace(/\s+/g, '');
};

export const isCamelCase = (token: string): boolean => {
  let newToken = token;
  const firstLower = token[0] === token[0].toLowerCase();
  const slice = newToken.length > 1 ? token.slice(1, token.length) : newToken;
  const containsUpper = slice.toLowerCase() !== slice;
  return firstLower && containsUpper;
};

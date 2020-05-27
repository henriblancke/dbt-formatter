export interface Node<T> {
  item: T;
  next?: Node<T>;
  previous?: Node<T>;
}

export interface Options {
  sql: string;
  indent: number;
  upper?: boolean;
  newline?: boolean;
  lowerWords?: boolean;
  allowCamelcase?: boolean;
}

export interface Config {
  reservedWords: string[];
  reservedTopLevelWords: string[];
  reservedNewLineWords: string[];
  stringTypes: string[];
  openParens: string[];
  closeParens: string[];
  indexedPlaceholderTypes: string[];
  namedPlaceholderTypes: string[];
  lineCommentTypes: string[];
  specialWordChars: string[];
}

export interface Preset {
  [s: string]: string[];
}

export interface SqlPresets {
  [s: string]: Preset;
}

export interface RegexDefinition {
  input: string;
  type: string;
  regex: RegExp;
  parseFunc?: (v: string) => string;
  description?: string;
}

export interface Token {
  type: string;
  value: string;
  key?: string;
}

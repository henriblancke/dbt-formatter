import Tokenizer from '@core/tokenizer';
import Formatter from '@core/formatter';
import { Config, Options } from '@types';
import { presets, formatters } from '@constants';

const getConfiguration = (opt: Options): Config => {
  const identifier = opt.sql;
  return {
    reservedWords: presets['reservedWords'][identifier],
    reservedTopLevelWords: presets['reservedTopLevelWords'][identifier],
    reservedNewLineWords: presets['reservedNewLineWords'][identifier],
    stringTypes: presets['stringTypes'][identifier],
    openParens: presets['openParens'][identifier],
    closeParens: presets['closeParens'][identifier],
    indexedPlaceholderTypes: presets['indexedPlaceholderTypes'][identifier],
    namedPlaceholderTypes: presets['namedPlaceholderTypes'][identifier],
    lineCommentTypes: presets['lineCommentTypes'][identifier],
    specialWordChars: presets['specialWordChars'][identifier],
  };
};

/**
 * Formats the sql string.
 *
 * @param {String} query
 * @param {Options} opt
 * @return {String}
 */
const format = (query: string, opt: Options = { sql: 'default', indent: 2 }): string => {
  if (!formatters.includes(opt.sql)) {
    throw Error(`Unsupported SQL dialect: ${opt.sql}`);
  }

  const config = getConfiguration(opt);
  const tokens = new Tokenizer(config).tokenize(query);
  return new Formatter(opt).format(tokens);
};

export default format;

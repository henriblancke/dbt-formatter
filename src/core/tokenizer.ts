import { isEmpty, escapeRegExp } from 'lodash'
import tokenTypes from '../constants/token-types'
import { dbtStartMarkers, dbtEndMarkers } from '../constants/presets'
import { Config, Token, RegexDefinition } from '../constants/interfaces'

export default class Tokenizer {
  /**
   * @param {Object} cfg
   *  @param {String[]} cfg.reservedWords Reserved words in SQL
   *  @param {String[]} cfg.reservedToplevelWords Words that are set to new line separately
   *  @param {String[]} cfg.reservedNewlineWords Words that are set to newline
   *  @param {String[]} cfg.stringTypes String types to enable: "", '', ``, [], N''
   *  @param {String[]} cfg.openParens Opening parentheses to enable, like (, [
   *  @param {String[]} cfg.closeParens Closing parentheses to enable, like ), ]
   *  @param {String[]} cfg.indexedPlaceholderTypes Prefixes for indexed placeholders, like ?
   *  @param {String[]} cfg.namedPlaceholderTypes Prefixes for named placeholders, like @ and :
   *  @param {String[]} cfg.lineCommentTypes Line comments to enable, like # and --
   *  @param {String[]} cfg.specialWordChars Special chars that can be found inside of words, like @ and #
   */

  cfg: Config

  constructor(cfg: Config) {
    this.cfg = cfg
  }

  static escapeParen(paren: string) {
    if (paren.length === 1) {
      // single punctuation character
      return escapeRegExp(paren)
    } else {
      // longer word
      return '\\b' + paren + '\\b'
    }
  }

  // This enables the following string patterns:
  // 1. backtick quoted string using `` to escape
  // 2. square bracket quoted string (SQL Server) using ]] to escape
  // 3. double quoted string using "" or \" to escape
  // 4. single quoted string using '' or \' to escape
  // 5. national character quoted string using N'' or N\' to escape
  static createStringPattern(types: string[]): string {
    const patterns: { [k: string]: string } = {
      '``': '((`[^`]*($|`))+)',
      '[]': '((\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*)',
      '""': '(("[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)',
      "''": "(('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
      "N''": "((N'[^N'\\\\]*(?:\\\\.[^N'\\\\]*)*('|$))+)"
    }

    return types.map(t => patterns[t]).join('|')
  }

  static createLineCommentRegex(ids: string[]) {
    return new RegExp(`^((?:${ids.map(id => escapeRegExp(id)).join('|')}).*?(?:\n|$))`)
  }

  static createMultiWordRegex(words: string[]) {
    const pattern = words.join('|').replace(/ /g, '\\s+')
    return new RegExp(`^(${pattern})\\b`, 'i')
  }

  static createWordRegex(chars: string[]) {
    return new RegExp(`^([\\w${chars.join('')}]+)`)
  }

  static createStringRegex(types: string[]) {
    return new RegExp('^(' + Tokenizer.createStringPattern(types) + ')')
  }

  static createParenRegex(parens: string[]) {
    return new RegExp('^(' + parens.map(p => Tokenizer.escapeParen(p)).join('|') + ')', 'i')
  }

  static createPlaceholderRegex(types: string[], pattern: string) {
    if (isEmpty(types)) {
      return /.^/
    }

    const typesRegex = types.map(escapeRegExp).join('|')
    return new RegExp(`^((?:${typesRegex})(?:${pattern}))`)
  }

  static getEscapedPlaceholderKey({ key, quoteChar }: { key: string; quoteChar: string }) {
    return key.replace(new RegExp(escapeRegExp('\\') + quoteChar, 'g'), quoteChar)
  }

  /**
   * Takes a SQL string and breaks it into tokens.
   * Each token is an object with type and value.
   *
   * @param {String} input The SQL string
   * @return {Object[]} tokens An array of tokens.
   *  @return {String} token.type
   *  @return {String} token.value
   */
  tokenize(input: string) {
    let token: Token = { type: '', value: '' }
    const tokens: Token[] = []

    // Keep processing the string until it is empty
    while (input.length) {
      // Get the next token
      const tmp = this.getNextToken(input, token)

      if (tmp) {
        token = tmp as Token
        input = input.substring(token.value.length)
        tokens.push(token)
      }
    }
    return tokens
  }

  getNextToken(input: string, prev: Token): Token | boolean {
    const regexes = this.getRegexes(input, prev)
    const sorted = Object.keys(regexes).sort()

    let result: Token | boolean = false
    for (const id in sorted) {
      const definition = regexes[id]
      result = Tokenizer.matchRegex(definition)
      if (result) {
        break
      }
    }

    return result
  }

  static matchRegex(df: RegexDefinition): Token | boolean {
    const matches = df.input.match(df.regex)
    if (matches && matches.index === 0) {
      return {
        type: df.type,
        value: matches[0],
        ...(df.parseFunc && { key: df.parseFunc(matches[0]) })
      }
    }
    return false
  }

  getRegexes(input: string, prev: Token): { [n: number]: RegexDefinition } {
    return {
      0: {
        input,
        type: tokenTypes.DBT_START_VAR,
        regex: /\{\s?\{\s?/,
        description: 'Finds start of a dbt/jinja variable.'
      },
      1: {
        input,
        type: tokenTypes.DBT_END_VAR,
        regex: /\s?\}\s?\}/,
        description: 'Finds end of a dbt/jinja variable.'
      },
      2: {
        input,
        type: tokenTypes.DBT_START_TEMPLATE,
        regex: /\s?\{\s?\%\-?/,
        description: 'Finds start of a dbt/jinja template/macro.'
      },
      3: {
        input,
        type: tokenTypes.DBT_END_TEMPLATE,
        regex: /\-?\%\s?\}/,
        description: 'Finds end of a dbt/jinja template/macro.'
      },
      4: {
        input,
        type: tokenTypes.DBT_START_MARKERS,
        regex: Tokenizer.createMultiWordRegex(dbtStartMarkers),
        description: 'Finds start marker words in template/macro.'
      },
      5: {
        input,
        type: tokenTypes.DBT_END_MARKERS,
        regex: Tokenizer.createMultiWordRegex(dbtEndMarkers),
        description: 'Finds end marker words in template/macro.'
      },
      6: {
        input,
        type: tokenTypes.WHITESPACE,
        regex: /^(\s+)/
      },
      7: {
        input,
        type: tokenTypes.LINE_COMMENT,
        regex: Tokenizer.createLineCommentRegex(this.cfg.lineCommentTypes)
      },
      8: {
        input,
        type: tokenTypes.BLOCK_COMMENT,
        regex: /^(\/\*[^]*?(?:\*\/|$))/
      },
      9: {
        input,
        type: tokenTypes.STRING,
        regex: Tokenizer.createStringRegex(this.cfg.stringTypes)
      },
      10: {
        input,
        type: tokenTypes.OPEN_PAREN,
        regex: Tokenizer.createParenRegex(this.cfg.openParens)
      },
      11: {
        input,
        type: tokenTypes.CLOSE_PAREN,
        regex: Tokenizer.createParenRegex(this.cfg.closeParens)
      },
      12: {
        input,
        type: tokenTypes.PLACEHOLDER,
        regex: Tokenizer.createPlaceholderRegex(this.cfg.namedPlaceholderTypes, '[a-zA-Z0-9._$]+'),
        parseFunc: v => v.slice(1),
        description: 'Indent named placeholder token'
      },
      13: {
        input,
        type: tokenTypes.PLACEHOLDER,
        regex: Tokenizer.createPlaceholderRegex(
          this.cfg.namedPlaceholderTypes,
          Tokenizer.createStringPattern(this.cfg.stringTypes)
        ),
        parseFunc: v =>
          Tokenizer.getEscapedPlaceholderKey({
            key: v.slice(2, -1),
            quoteChar: v.slice(-1)
          }),
        description: 'String named placeholder token'
      },
      14: {
        input,
        type: tokenTypes.PLACEHOLDER,
        regex: Tokenizer.createPlaceholderRegex(this.cfg.indexedPlaceholderTypes, '[0-9]*'),
        parseFunc: v => v.slice(1),
        description: 'Index placeholder token'
      },
      15: {
        input,
        type: tokenTypes.NUMBER,
        regex: /^((-\s*)?[0-9]+(\.[0-9]+)?|0x[0-9a-fA-F]+|0b[01]+)\b/
      },
      16: {
        input,
        type: tokenTypes.RESERVED_TOPLEVEL,
        regex: Tokenizer.getReservedWordToken(
          input,
          prev,
          Tokenizer.createMultiWordRegex(this.cfg.reservedTopLevelWords)
        )
      },
      17: {
        input,
        type: tokenTypes.RESERVED_NEWLINE,
        regex: Tokenizer.getReservedWordToken(
          input,
          prev,
          Tokenizer.createMultiWordRegex(this.cfg.reservedNewLineWords)
        )
      },
      18: {
        input,
        type: tokenTypes.RESERVED,
        regex: Tokenizer.getReservedWordToken(
          input,
          prev,
          Tokenizer.createMultiWordRegex(this.cfg.reservedWords)
        )
      },
      19: {
        input,
        type: tokenTypes.WORD,
        regex: Tokenizer.createWordRegex(this.cfg.specialWordChars)
      },
      20: {
        input,
        type: tokenTypes.OPERATOR,
        regex: /^(!=|<>|==|<=|>=|!<|!>|\|\||::|->>|->|~~\*|~~|!~~\*|!~~|~\*|!~\*|!~|.)/
      }
    }
  }

  static getReservedWordToken(input: string, prev: Token, regex: RegExp) {
    // A reserved word cannot be preceded by a "."
    // this makes it so in "mytable.from", "from" is not considered a reserved word
    if (prev && prev.value && prev.value === '.') {
      return /.^/
    }
    return regex
  }
}

import Indentation from './indentation';
import InlineBlock from './inline-block';
import * as normalize from '../tools/normalize';
import tokenTypes from '../constants/token-types';
import { DbtConfig } from '../constants/presets';
import { Node, LinkedList } from '../tools/linked-list';
import { Options, Token } from '../constants/interfaces';

// Whitespaces:
// 1. The previous token will always append a whitespace (if needed).
// 2. You probably don't have to append a whitespace to start of token.

// Tokens:
// 1. Always try to derive rules based on next token when dependencies are necassary

export default class Formatter {
  upper: boolean = false;
  newline: boolean = true;
  indentation: Indentation;
  variableName: string = '';
  lowerWords: boolean = false;
  allowCamelcase: boolean = true;
  inlineOneLiner: boolean = false;
  inTemplateBlock: boolean = false;
  inVariableBlock: boolean = false;
  inIncrementalBlock: boolean = false;
  inlineBlock: InlineBlock = new InlineBlock();
  previousReservedWord: Token = { type: '', value: '' };

  constructor(opt: Options) {
    const { indent, upper, newline, lowerWords, allowCamelcase } = opt;
    this.upper = upper || this.upper;
    this.newline = newline || this.newline;
    this.indentation = new Indentation(indent);
    this.lowerWords = lowerWords || this.lowerWords;
    this.allowCamelcase = allowCamelcase || this.allowCamelcase;
  }

  public format = (tokens: LinkedList<Token>): string => {
    let formattedQuery = '';

    for (const node of tokens.items()) {
      const token = node.item;
      // order of statements is important
      if (token.type === tokenTypes.DBT_START_VAR) {
        formattedQuery = this.formatVariableStart(node, formattedQuery);
      } else if (token.type === tokenTypes.DBT_END_VAR) {
        formattedQuery = this.formatVariableEnd(node, formattedQuery);
      } else if (token.type === tokenTypes.DBT_START_TEMPLATE) {
        formattedQuery = this.formatTemplateStart(node, formattedQuery);
      } else if (token.type === tokenTypes.DBT_END_TEMPLATE) {
        formattedQuery = this.formatTemplateEnd(node, formattedQuery);
      } else if (token.type === tokenTypes.DBT_START_MARKERS) {
        formattedQuery = this.formatDBTStartMarker(node, formattedQuery);
      } else if (token.type === tokenTypes.DBT_END_MARKERS) {
        formattedQuery = this.formatDBTEndMarker(node, formattedQuery);
      } else if (token.type === tokenTypes.WHITESPACE) {
        // ignore (we do our own whitespace formatting)
      } else if (token.type === tokenTypes.LINE_COMMENT) {
        formattedQuery = this.formatLineComment(node, formattedQuery);
      } else if (token.type === tokenTypes.BLOCK_COMMENT) {
        formattedQuery = this.formatBlockComment(node, formattedQuery);
      } else if (token.type === tokenTypes.RESERVED_TOPLEVEL) {
        formattedQuery = this.formatToplevelReservedWord(node, formattedQuery);
        this.previousReservedWord = token;
      } else if (token.type === tokenTypes.RESERVED_NEWLINE) {
        formattedQuery = this.formatNewlineReservedWord(node, formattedQuery);
        this.previousReservedWord = token;
      } else if (token.type === tokenTypes.RESERVED) {
        formattedQuery = this.formatReservedWord(node, formattedQuery);
        this.previousReservedWord = token;
      } else if (token.type === tokenTypes.OPEN_PAREN) {
        formattedQuery = this.formatOpeningParentheses(node, formattedQuery);
      } else if (token.type === tokenTypes.CLOSE_PAREN) {
        formattedQuery = this.formatClosingParentheses(node, formattedQuery);
      } else if (token.value === ',') {
        formattedQuery = this.formatComma(node, formattedQuery);
      } else if (token.value === ':') {
        formattedQuery = this.formatWithSpaceAfter(node, formattedQuery);
      } else if (token.value === '.') {
        formattedQuery = this.formatWithoutSpaces(node, formattedQuery);
      } else if (token.value === ';') {
        formattedQuery = this.formatQuerySeparator(node, formattedQuery);
      } else if (token.type === tokenTypes.WORD) {
        formattedQuery = this.formatWord(node, formattedQuery);
      } else {
        formattedQuery = this.formatWithSpaces(node, formattedQuery);
      }
    }

    const appendix = this.newline ? '\n' : '';
    return formattedQuery.trim() + appendix;
  };

  private indentComment = (comment: string): string => {
    return comment.replace(/\n/g, '\n' + this.indentation.getIndent());
  };

  private trimTrailingWhitespace = (node: Node<Token>, query: string): string => {
    let appendix = '';
    const nextType = node.next ? node.next.item.type : undefined;

    if (nextType === tokenTypes.LINE_COMMENT) {
      appendix = '\n';
    }
    return normalize.trimEnd(query) + appendix;
  };

  private addNewline = (query: string, lines: number = 1): string => {
    return normalize.trimEnd(query) + '\n'.repeat(lines) + this.indentation.getIndent();
  };

  private getNextNodeNonWhitespace = (node: Node<Token>): Node<Token> | undefined => {
    let nextNode: Node<Token> | undefined = node.next;
    while (nextNode && nextNode.item.type === tokenTypes.WHITESPACE) {
      nextNode = nextNode.next;
    }
    return nextNode;
  };

  private getPreviousNodeNonWhitespace = (node: Node<Token>): Node<Token> | undefined => {
    let previousNode: Node<Token> | undefined = node.previous;
    while (previousNode && previousNode.item.type === tokenTypes.WHITESPACE) {
      previousNode = previousNode.previous;
    }
    return previousNode;
  };

  private countWordsBetweenParenthesis = (node: Node<Token>): number => {
    if (node.item.type !== tokenTypes.OPEN_PAREN) {
      return 0;
    }

    let wordCount = 0;
    let nextNode: Node<Token> | undefined = node.next;
    while (nextNode && nextNode.item.type !== tokenTypes.CLOSE_PAREN) {
      if (nextNode.item.value !== ',') {
        wordCount++;
      }
      nextNode = nextNode.next;
    }
    return wordCount;
  };

  /*
   * FORMATTERS
   */
  private formatVariableStart = (node: Node<Token>, query: string): string => {
    this.inVariableBlock = true;

    const token = node.item;
    const nextToken = this.getNextNodeNonWhitespace(node);
    this.variableName = nextToken ? nextToken.item.value : '';
    return query + normalize.addWhitespace(normalize.removeWhitespace(token.value));
  };

  private formatVariableEnd = (node: Node<Token>, query: string): string => {
    this.inVariableBlock = false;

    // Remove whitespaces from token and add space at the end
    const token = node.item.value;
    const nextToken = this.getNextNodeNonWhitespace(node);
    query += normalize.addWhitespace(normalize.removeWhitespace(token));

    // If the next token is a reserved word (as, when,...) don't add
    // a new line.
    const noNewLine =
      nextToken &&
      (nextToken.item.type === tokenTypes.RESERVED ||
        DbtConfig.dbtControl.includes(nextToken.item.value.toLowerCase()));
    if (noNewLine) {
      return query;
    }

    /*
     ** Logic when to add a double new line **
     * If the next token is a reserved top level sql word -> add 2 lines
     * If the next token is a dbt template start token -> add 2 lines
     */
    const doubleLine =
      nextToken &&
      (nextToken.item.type === tokenTypes.RESERVED_TOPLEVEL ||
        nextToken.item.type === tokenTypes.DBT_START_TEMPLATE);

    const lines = doubleLine ? 2 : 1;
    return this.addNewline(query, lines);
  };

  private formatTemplateStart = (node: Node<Token>, query: string): string => {
    this.inTemplateBlock = true;

    const token = node.item;
    const nextToken = this.getNextNodeNonWhitespace(node);
    const previousToken = this.getPreviousNodeNonWhitespace(node);
    const secondNextToken = nextToken ? this.getNextNodeNonWhitespace(nextToken) : undefined;
    let newToken = normalize.addWhitespace(normalize.removeWhitespace(token.value));

    /*
     ** Currently there are two special cases in jinja that we account for here:
     * 1. {% else % }: needs to be format 1 indent down
     * 2. {% if is_incremental() %}: needs to reset to indent: 0
     */
    if (nextToken && nextToken.item.value.toLowerCase() === 'else') {
      this.indentation.decreaseTopLevel();
      query = this.addNewline(query);
      this.indentation.increaseToplevel();
    } else if (
      nextToken &&
      DbtConfig.dbtControl.includes(nextToken.item.value.toLowerCase()) &&
      (secondNextToken && secondNextToken.item.value.toLowerCase() === 'is_incremental')
    ) {
      this.indentation.reset();
      this.inIncrementalBlock = true;
      query = this.addNewline(query, 2);
    } else if (nextToken && nextToken.item.type === tokenTypes.DBT_END_MARKERS) {
      const isTopLevel = DbtConfig.topLevelWords.includes(nextToken.item.value.toLowerCase());

      if (isTopLevel) {
        this.indentation.reset();
      } else {
        this.indentation.decreaseTopLevel();
      }
      query = this.addNewline(query);
    } else if (
      nextToken &&
      nextToken.item.type === tokenTypes.DBT_START_MARKERS &&
      !DbtConfig.singleLineWords.includes(nextToken.item.value.toLowerCase())
    ) {
      this.indentation.increaseToplevel();

      if (previousToken && previousToken.item.type === tokenTypes.WORD) {
        // if previous token is a word, give it some space and decrease indentation
        this.indentation.decreaseTopLevel();
        query = this.addNewline(query, 2);
      }
    }

    return query + newToken;
  };

  private formatTemplateEnd = (node: Node<Token>, query: string) => {
    this.inTemplateBlock = false;

    const token = node.item;
    query += normalize.addWhitespace(token.value);
    const previousToken = this.getPreviousNodeNonWhitespace(node);
    const doubleLineMarker =
      previousToken && previousToken.item.value
        ? DbtConfig.doubleLineMarkers.includes(previousToken.item.value.toLowerCase())
        : false;

    const lines = doubleLineMarker ? 2 : 1;
    return this.addNewline(query, lines);
  };

  private formatDBTStartMarker = (node: Node<Token>, query: string) => {
    const token = node.item;
    return query + normalize.addWhitespace(token.value);
  };

  private formatDBTEndMarker = (node: Node<Token>, query: string) => {
    const token = node.item;
    return query + normalize.addWhitespace(token.value);
  };

  private formatLineComment = (node: Node<Token>, query: string) => {
    const token = node.item;
    return this.addNewline(query + token.value);
  };

  private formatBlockComment = (node: Node<Token>, query: string) => {
    const token = node.item;
    return this.addNewline(this.addNewline(query) + this.indentComment(token.value));
  };

  private formatReservedWord = (node: Node<Token>, query: string) => {
    const token = node.item;
    token.value = this.upper ? token.value.toUpperCase() : token.value;
    return this.formatWithSpaces(node, query);
  };

  private formatToplevelReservedWord = (node: Node<Token>, query: string) => {
    const token = node.item;
    const prevToken = this.getPreviousNodeNonWhitespace(node);

    // if we are inside dbt template brackets don't add newline
    // there is some sql and jinja overlap that we account for here.
    if (
      (prevToken && prevToken.item.type === tokenTypes.DBT_START_TEMPLATE) ||
      this.inTemplateBlock ||
      this.inVariableBlock
    ) {
      const newToken = normalize.addWhitespace(token.value.toLowerCase());
      return query + normalize.equalizeWhitespace(newToken);
    }

    // WITH table as () is a special case.
    if (token.value.toLowerCase() === 'with') {
      const newToken = normalize.addWhitespace(
        this.upper ? token.value.toUpperCase() : token.value
      );
      return query + normalize.equalizeWhitespace(newToken);
    }

    // when in `is_incremental` block keep current indentation level
    // if the previous token is a dbt config variable keep current indentation
    const previousConfigBlock = this.variableName.toLowerCase() === 'config';
    if (this.inIncrementalBlock || previousConfigBlock) {
      this.variableName = '';
      this.inIncrementalBlock = false;
    } else {
      this.indentation.decreaseTopLevel();
    }

    query = this.addNewline(query, previousConfigBlock ? 2 : 1);

    // TODO: Make reusable function
    const newToken = this.upper ? token.value.toUpperCase() : token.value;

    query += normalize.equalizeWhitespace(newToken);
    this.indentation.increaseToplevel();
    query = this.addNewline(query);
    return query;
  };

  private formatNewlineReservedWord = (node: Node<Token>, query: string) => {
    const token = node.item;
    if (this.inTemplateBlock) {
      const newToken = normalize.addWhitespace(token.value.toLowerCase());
      return query + normalize.equalizeWhitespace(newToken);
    }

    const newToken = this.upper ? token.value.toUpperCase() : token.value;
    return this.addNewline(query) + normalize.addWhitespace(newToken);
  };

  // Opening parentheses increase the block indent level and start a new line
  private formatOpeningParentheses = (node: Node<Token>, query: string) => {
    // Take out the preceding space unless there was whitespace there in the original query
    // or another opening parens or line comment
    const preserveWhitespaceFor = [
      tokenTypes.WHITESPACE,
      tokenTypes.OPEN_PAREN,
      tokenTypes.LINE_COMMENT,
    ];

    if (node.previous && !preserveWhitespaceFor.includes(node.previous.item.type)) {
      query = normalize.trimEnd(query);
    }
    query += node.item.value;

    this.inlineBlock.beginIfPossible(node);

    const nextNode = this.getNextNodeNonWhitespace(node);

    /*
     ** Determine if text within parentheses should be a one liner
     * 1. When the there is no text `()`
     * 2. When there is only 1 word in between brackets
     */
    this.inlineOneLiner = this.countWordsBetweenParenthesis(node) <= 1;

    // only increase block level when inline block is active and next token is not a closing parenthesis
    if (!this.inlineBlock.isActive() && !this.inlineOneLiner) {
      this.indentation.increaseBlockLevel();
      query = this.addNewline(query);
    }

    return query;
  };

  // Closing parentheses decrease the block indent level
  private formatClosingParentheses = (node: Node<Token>, query: string) => {
    if (this.inlineBlock.isActive()) {
      this.inlineBlock.end();
      return this.formatWithSpaceAfter(node, query);
    } else if (this.inlineOneLiner) {
      this.inlineOneLiner = false;
      return this.formatWithSpaceAfter(node, query);
    } else {
      this.indentation.decreaseBlockLevel();
      return this.formatWithSpaces(node, this.addNewline(query));
    }
  };

  // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
  private formatComma = (node: Node<Token>, query: string) => {
    const token = node.item;
    query = this.trimTrailingWhitespace(node, query) + token.value + ' ';

    if (this.inlineBlock.isActive()) {
      return query;
    } else if (/^LIMIT$/i.test(this.previousReservedWord.value)) {
      return query;
    } else {
      return this.addNewline(query);
    }
  };

  private formatWithSpaceAfter = (node: Node<Token>, query: string) => {
    const token = node.item;
    return this.trimTrailingWhitespace(node, query) + normalize.addWhitespace(token.value);
  };

  private formatWithoutSpaces = (node: Node<Token>, query: string) => {
    const token = node.item;
    return this.trimTrailingWhitespace(node, query) + token.value;
  };

  private formatWithSpaces = (node: Node<Token>, query: string) => {
    const token = node.item;
    return query + normalize.addWhitespace(token.value);
  };

  private formatWord = (node: Node<Token>, query: string) => {
    const token = node.item;
    let newToken = token.value;
    if (this.lowerWords) {
      const isCamelCase = normalize.isCamelCase(token.value);
      newToken = isCamelCase && this.allowCamelcase ? token.value : token.value.toLowerCase();
    }
    return query + normalize.addWhitespace(newToken);
  };

  private formatQuerySeparator = (node: Node<Token>, query: string) => {
    const token = node.item;
    return this.trimTrailingWhitespace(node, query) + token.value + '\n';
  };
}

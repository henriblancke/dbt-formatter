import tokenTypes from '../constants/token-types';
import { Token } from '../constants/interfaces';
import { Node } from '../tools/linked-list';

const INLINE_MAX_LENGTH = 50;

export default class InlineBlock {
  level: number = 0;

  /**
   * Begins inline block when lookahead through upcoming tokens determines
   * that the block would be smaller than INLINE_MAX_LENGTH.
   * @param  {Object[]} tokens Array of all tokens
   * @param  {Number} index Current token position
   */
  public beginIfPossible = (node: Node<Token>) => {
    if (this.level === 0 && this.isInlineBlock(node)) {
      this.level = 1;
    } else if (this.level > 0) {
      this.level++;
    } else {
      this.level = 0;
    }
  };

  /**
   * Finishes current inline block.
   * There might be several nested ones.
   */
  public end = () => {
    this.level--;
  };

  /**
   * True when inside an inline block
   * @return {Boolean}
   */
  public isActive = () => {
    return this.level > 0;
  };

  // Check if this should be an inline parentheses block
  // Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2), {% ... %}, {{...}}
  private isInlineBlock = (node: Node<Token>): boolean => {
    let level = 0;
    let length = 0;
    let currentNode = node;

    while (currentNode.next) {
      const token = currentNode.next.item;
      length += token.value.length;

      if (length > INLINE_MAX_LENGTH) {
        return false;
      }

      if ([tokenTypes.OPEN_PAREN, tokenTypes.DBT_START_TEMPLATE].includes(token.type)) {
        level++;
      } else if ([tokenTypes.CLOSE_PAREN, tokenTypes.DBT_END_TEMPLATE].includes(token.type)) {
        level--;
        if (level === 0) {
          return true;
        }
      }

      if (InlineBlock.isForbiddenToken(token)) {
        return false;
      }

      currentNode = currentNode.next;
    }

    return false;
  };

  // Reserved words that cause newlines, comments and semicolons
  // are not allowed inside inline parentheses block
  private static isForbiddenToken = ({ type, value }: Token): boolean => {
    return (
      type === tokenTypes.RESERVED_TOPLEVEL ||
      type === tokenTypes.RESERVED_NEWLINE ||
      type === tokenTypes.BLOCK_COMMENT ||
      value === ';'
    );
  };
}

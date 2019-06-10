import tokenTypes from '../constants/token-types'
import { Token } from '../constants/interfaces'

const INLINE_MAX_LENGTH = 50

export default class InlineBlock {
  level: number = 0

  /**
   * Begins inline block when lookahead through upcoming tokens determines
   * that the block would be smaller than INLINE_MAX_LENGTH.
   * @param  {Object[]} tokens Array of all tokens
   * @param  {Number} index Current token position
   */
  beginIfPossible(tokens: Token[], index: number) {
    if (this.level === 0 && this.isInlineBlock(tokens, index)) {
      this.level = 1
    } else if (this.level > 0) {
      this.level++
    } else {
      this.level = 0
    }
  }

  /**
   * Finishes current inline block.
   * There might be several nested ones.
   */
  end() {
    this.level--
  }

  /**
   * True when inside an inline block
   * @return {Boolean}
   */
  isActive() {
    return this.level > 0
  }

  // Check if this should be an inline parentheses block
  // Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)
  isInlineBlock(tokens: Token[], index: number) {
    let level = 0
    let length = 0

    for (let i = index; i < tokens.length; i++) {
      const token = tokens[i]
      length += token.value.length

      if (length > INLINE_MAX_LENGTH) {
        return false
      }

      if (token.type === tokenTypes.OPEN_PAREN) {
        level++
      } else if (token.type === tokenTypes.CLOSE_PAREN) {
        level--
        if (level === 0) {
          return true
        }
      }

      if (InlineBlock.isForbiddenToken(token)) {
        return false
      }
    }
    return false
  }

  // Reserved words that cause newlines, comments and semicolons
  // are not allowed inside inline parentheses block
  private static isForbiddenToken({ type, value }: Token) {
    return (
      type === tokenTypes.RESERVED_TOPLEVEL ||
      type === tokenTypes.RESERVED_NEWLINE ||
      type === tokenTypes.BLOCK_COMMENT ||
      value === ';'
    )
  }
}

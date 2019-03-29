export interface Error$MessageFrameAST {
  /**
   * The file in the stack that had a caller
   * in it that led to this error being risen.
   *
   * Should be a fully resolved path for terminals
   * that support clicable links in their terminal
   * emulator.
   */
  file?: string,

  /**
   * The calling function in the stack, will
   * usually have a line with it too.
   */
  caller?: string,

  /**
   * The line that this
   * caller is on to be traced back.
   */
  line?: number,

  /**
   * The column that this
   * caller is on to be traced back.
   */
  column?: number,

  /**
   * The module that this file is in, I.E
   * multicolour/AJV. This will help you to
   * discover whether or not it's your fault
   * or mine! <3
   */
  module?: string,
}

/**
 * An object we can quickly generate from an error
 * and even faster process into a helpful message
 * for you, the developer.
 */
export interface Error$MessageAST {
  /**
   * The message passed into the *Error constructor.
   */
  message: string,

  /**
   * The stack from the error constructor.
   */
  stack: Error$MessageFrameAST[],

  /**
   * The number of frames dropped fromm the
   * stack becuase they matches the ignored_packages
   * filter.
   */
  framesDropped?: number
}


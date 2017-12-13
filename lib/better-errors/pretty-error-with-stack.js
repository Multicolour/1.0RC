// @flow

class PrettyErrorWithStack extends Error {

  /**
   * If it's NodeJS, we'll use CLI colours
   * and characters to format the message
   * but if it's not we'll output some
   * HTML.
   * 
   * @type {boolean}
   */
  nodejs: boolean

  /**
   * Ommit lines in the stack trace that match
   * these patterns. Can be string or a RegExp.
   * 
   * @type {Array<string | RegExp>}
   */
  ignored_packages: RegExp

  constructor(message: string) {
    super(message)

    this.nodejs = true

    this.ignored_packages = /(module.js|bootstrap_node.js|node_modules\/flow-remove-types|next_tick.js|node_modules\/jest-jasmine2)/ // eslint-disable-line
  }

  /**
   * Modify the target object and add the various
   * parsed parts of the stack frame so the object
   * can be parsed into a CLI string or a HTML page.
   * 
   * @param {string} part to parse 
   * @param {Object} ast object to add parts to.
   */
  parse_stack_frame_part(part: string, ast: Object): void {
    const path_line_column_regex = /(?![()])(.*):(\d+):(\d+)/g
    const bound_caller_regex = /^\[as (.*)\]$/g

    if (path_line_column_regex.test(part)) {
      const matches = part.split(":")

      if (matches) {
        const [file, line, column] = matches
        ast.file = file.replace("(", "")
        ast.line = Number(line)
        ast.column = Number(column.replace(")", ""))
      }
    }
    else if (bound_caller_regex.test(part)) {
      const bound_as = part.match(bound_caller_regex)

      if (bound_as)
        ast.caller = (ast.caller || "") + " bound as " + bound_as[0]
    }
  }

  /**
   * Parse the frame of a stack trace to an
   * friendly object so that we can later turn
   * it into a pretty message that's also helpful.
   * 
   * @param {string} frame to parse into AST.
   */
  parse_stack_frame(frame: string): Error$MessageFrameAST {
    // Split the parts and remove the "at " that begins on each line.
    const parts_raw = frame
      .split(/\s+(?=[^\])}]*([[({]|$))/g)
      .slice(1)
      .filter(part => part !== "" && part !== "(" && part !== "[")

    const named_parts = {}

    if (parts_raw.length !== 1) {
      named_parts.caller = parts_raw[0]
      parts_raw.splice(0, 1)
    }

    parts_raw.forEach(part => {
      this.parse_stack_frame_part(part, named_parts)
    })

    return named_parts
  }

  /**
   * Parse the error object into a format we 
   * understand and can prettify.
   * 
   * @return {Error$MessageAST} parsed error stack and message.
   */
  get_message_ast(): Error$MessageAST {
    const parsed_stack = this.stack
      .split("\n")
      .filter(line => Boolean(line))
      .map(line => line.trim())
      .slice(1)
      .map((frame: string) => this.parse_stack_frame(frame))
      .filter((frame_ast: Error$MessageFrameAST) => Object.keys(frame_ast).length > 0)

    const filtered_stack = parsed_stack
      .filter((frame_ast: Error$MessageFrameAST) => !this.ignored_packages.test(frame_ast.file || ""))

    return {
      message: this.message,

      // Create a stack of frames bar the original message.
      stack: filtered_stack,

      frames_dropped: parsed_stack.length - filtered_stack.length,
    }
  }

  toString(): string {
    const chalk = require("chalk")
    const message_ast = this.get_message_ast()

    console.log("CLI", message_ast)
    return JSON.stringify(message_ast)
  }
}

module.exports = PrettyErrorWithStack

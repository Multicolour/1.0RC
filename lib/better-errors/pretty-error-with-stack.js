// @flow

class PrettyErrorWithStack extends Error {
  static ignoredPackages: RegExp

  /**
   * Modify the target object and add the various
   * parsed parts of the stack frame so the object
   * can be parsed into a CLI string or a HTML page.
   * 
   * @param {string} part to parse 
   * @param {Object} ast object to add parts to.
   */
  parseStackFramePart(part: string, ast: Object): void {
    const pathLineColumnRegex = /(?![()])(.*):(\d+):(\d+)/g
    const boundCallerRegex = /^\[as (.*)\]$/g

    if (pathLineColumnRegex.test(part)) {
      const matches = part.split(":")

      if (matches) {
        const [file, line, column] = matches
        ast.file = file.replace("(", "")
        ast.line = Number(line)
        ast.column = Number(column.replace(")", ""))
      }
    } else if (boundCallerRegex.test(part)) {
      const boundAs = part.match(boundCallerRegex)

      if (boundAs)
        ast.caller = (ast.caller || "") + " bound as " + boundAs[0]
    }
  }

  /**
   * Parse the frame of a stack trace to an
   * friendly object so that we can later turn
   * it into a pretty message that's also helpful.
   * 
   * @param {string} frame to parse into AST.
   */
  parseStackFrame(frame: string): Error$MessageFrameAST {
    // Split the parts and remove the "at " that begins on each line.
    const partsRaw = frame
      .split(/\s+(?=[^\])}]*([[({]|$))/g)
      .slice(1)
      .filter(part => part !== "" && part !== "(" && part !== "[")

    const namedParts = {}

    if (partsRaw.length !== 1) {
      namedParts.caller = partsRaw[0]
      partsRaw.splice(0, 1)
    }

    partsRaw.forEach(part => {
      this.parseStackFramePart(part, namedParts)
    })

    return namedParts
  }

  /**
   * Parse the error object into a format we 
   * understand and can prettify.
   * 
   * @return {Error$MessageAST} parsed error stack and message.
   */
  getMessageAst(): Error$MessageAST {
    const parsedStack = this.stack
      .split("\n")
      .filter(line => Boolean(line))
      .map(line => line.trim())
      .slice(1)
      .map((frame: string) => this.parseStackFrame(frame))
      .filter((frameAST: Error$MessageFrameAST) => Object.keys(frameAST).length > 0)

    const filteredStack = parsedStack
      .filter((frameAST: Error$MessageFrameAST) => !PrettyErrorWithStack.ignoredPackages.test(frameAST.file || ""))

    return {
      message: this.message,

      // Create a stack of frames bar the original message.
      stack: filteredStack,

      // How many frames did we drop during the filtering phase?
      framesDropped: parsedStack.length - filteredStack.length,
    }
  }

  toStdout(): string {
    const chalk = require("chalk")
    const messageAST = this.getMessageAst()
    const messages = [
      chalk.bold.red("ERROR:", chalk.underline.italic(messageAST.message)),
      ...messageAST.stack.map((frame: Error$MessageFrameAST) => {
        return [
          "\n",
          chalk.yellow.bold(frame.caller),
          chalk.gray.italic(frame.file),
          frame.line ? chalk.gray("line", frame.line) : "",
          frame.column ? chalk.gray("column", frame.column) : "",
        ].map(line => "  " + line).join("\n")
      }),
      chalk.dim("Filtered out", messageAST.framesDropped, "frames from the stack."),
    ]

    return messages.join("\n")
  }
}

/**
 * Ommit lines in the stack trace that match
 * these patterns. Can be string or a RegExp.
 * 
 * @type {RegExp}
 */
PrettyErrorWithStack.ignoredPackages = /(module.js|bootstrap_node.js|node_modules\/flow-remove-types|next_tick.js|node_modules\/jest-jasmine2)/ // eslint-disable-line

module.exports = PrettyErrorWithStack

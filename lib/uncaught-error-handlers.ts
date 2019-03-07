import UncaughtError from "./better-errors/uncaught-error"

// @FIXME: Work out if this is a TypeScript bug.
// (Error as any).stackTraceLimit = Infinity

(process as NodeJS.EventEmitter)
  .on("uncaughtException", (error: Error) => {
    console.error(new UncaughtError("An uncaught error occured, please wrap in a try catch block.", error).prettify()) // eslint-disable-line
  })
  .on("unhandledRejection", (error: Error) => {
    console.error(new UncaughtError("An promise rejection occured, please add a .catch((error: Error) => handler) to your code where the stack below instructs.", error).prettify()) // eslint-disable-line
  })


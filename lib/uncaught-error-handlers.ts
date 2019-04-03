import UncaughtError from "@lib/better-errors/uncaught-error"

// @FIXME: Work out if this is a TypeScript bug.
// (Error as any).stackTraceLimit = Infinity

process
  .on("uncaughtException", (error: Error) => {
    // tslint:disable-next-line:max-line-length
    console.error(new UncaughtError("An uncaught error occured, please wrap in a try catch block.", error).prettify())
  })

process
  .on("unhandledRejection", (reason: {} | null | undefined, uncaughtPromise: Promise<any>) => {
    const logID = Date.now().toString(16)

    // tslint:disable-next-line:max-line-length
    console.error(new UncaughtError(logID + ": An promise rejection occured, please add a .catch((error: Error) => handler) to your code where the stack below instructs.", reason).prettify())

    uncaughtPromise.then(() => ({
      statusCode: 500,
      // tslint:disable-next-line:max-line-length
      errors: "An unexpected error has happened that this service tried to recover from. This is a developer problem, please contact the owner of this service and quote this reference so they can find the cause in their server logs. " + logID
    }))
  })


;(Error as any).stackTraceLimit = Infinity // eslint-disable-line @typescript-eslint/no-explicit-any
import UncaughtError from "@lib/better-errors/uncaught-error"

process.on("uncaughtException", (error: Error) => {
  // tslint:disable-next-line:max-line-length
  console.error(
    new UncaughtError(
      "An uncaught error occured, please wrap in a try catch block.",
      error,
    ).prettify(),
  )
})

process.on(
  "unhandledRejection",
  async (
    reason: Record<string, unknown> | null | undefined,
    uncaughtPromise: Promise<unknown>,
  ) => {
    const logID = Date.now().toString(16)

    console.error(
      new UncaughtError(
        logID +
          // tslint:disable-next-line:max-line-length
          ": An promise rejection occured, please add a .catch((error: Error) => handler) to your code where the stack below instructs.",
        reason,
      ).prettify(),
    )

    return uncaughtPromise.then(() => ({
      statusCode: 500,
      errors:
        // tslint:disable-next-line:max-line-length
        "An unexpected error has happened that this service tried to recover from. This is a developer problem, please contact the owner of this service and quote this reference so they can find the cause in their server logs. " +
        logID,
    }))
  },
)

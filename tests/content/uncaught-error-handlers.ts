import debug from "debug"

{
  const log = debug("Multicolour:tests")

  process
    .on("uncaughtException", (error: Error) => {
      log(error)
      log(error.stack)
    })
    .on("unhandledRejection", (reason: any, promise: Promise<any>) => {
      log(reason)
      log(promise)
    })
}

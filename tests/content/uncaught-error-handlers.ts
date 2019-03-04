{
  const debug = require("debug")("Multicolour:tests")
  process
    .on("uncaughtException", (error: Error) => {
      debug(error)
      debug(error.stack)
    })
    .on("unhandledRejection", (error: Error) => {
      debug(error)
      debug(error.stack)
    })
}

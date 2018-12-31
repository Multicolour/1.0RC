// @flow

process
  .on("uncaughtException", (error: Error) => {
    console.error(error)
    console.error(error.stack)
  })
  .on("unhandledRejection", (error: Error) => {
    console.error(error)
    console.error(error.stack)
  })

// @flow

const UncaughtError = require("./better-errors/uncaught-error")

process
  .on("uncaughtException", (error: Error) => {
    console.error(new UncaughtError("An uncaught error occured, please wrap in a try catch block.", error).prettify()) // eslint-disable-line
  })
  .on("unhandledRejection", (error: Error) => {
    console.error(new UncaughtError("An promise rejection occured, please add a .catch((error: Error) => handler) to your code.", error).prettify()) // eslint-disable-line
  })
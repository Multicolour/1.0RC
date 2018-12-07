// @flow

const HttpError = require("../../../better-errors/http-error")
const Promise = require("bluebird")

async function JsonParser(json: string): Promise<Object> {
  let outwardBody

  if (json[0] !== "{" && json[0] !== "[")
    throw new HttpError({
      statusCode: 400,
      error: {
        message: "Your JSON isn't structured correctly, the issue is at \nline: 0 \ncolumn: 0",
      },
    })

  try {
    outwardBody = JSON.parse(json)
  }
  catch (error) {
    throw new HttpError({
      statusCode: 400,
      error: {
        message: "Invalid JSON received.",
      },
    })
  }

  outwardBody
}

module.exports = JsonParser

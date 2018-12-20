// @flow

import type { ClientRequest } from "http"

const Promise = require("bluebird")

const bodyParser = require("../body-parser")
const HttpError = require("../../../better-errors/http-error")

async function JsonParser(request: ClientRequest): Promise<Object> {
  let outwardBody
  const json = await bodyParser({ request })

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

JsonParser.negotiationAccept = "application/json"

module.exports = JsonParser

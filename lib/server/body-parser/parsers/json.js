// @flow

import type {
  Resolve,
  Reject,
} from "bluebird"

const HttpError = require("../../../better-errors/http-error")
const Promise = require("bluebird")

async function JsonParser(json: string): Promise<Object> {
  return new Promise((resolve: Resolve, reject: Reject) => {
    if (json[0] !== "{" && json[0] !== "[")
      return reject(new HttpError({
        statusCode: 400,
        errors: [{
          message: "Your JSON isn't structured correctly, the issue is at \nline: 0 \ncolumn: 0",
        }],
      }))


  })
}

module.exports = JsonParser

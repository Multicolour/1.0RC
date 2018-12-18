// @flow

const Promise = require("bluebird")
const formidable = require("formidable")

import type { ClientRequest } from "http"

async function multipartBodyParser(request: ClientRequest): Promise<Object> {
  const form = new formidable.IncomingForm()

  return new Promise((resolve, reject) => {
    form.parse(request, (err, fields, files) => {
      if (err) reject(err)
      else
        resolve({
          ...fields,
          ...files,
        })
    })
  })
}

multipartBodyParser.negotiationName = "multipart/form-data"

module.exports = multipartBodyParser

// @flow

import type { Resolve, Reject } from "bluebird"
import type { ClientRequest } from "http"

const Promise = require("bluebird")
const { IncomingForm } = require("formidable")

async function multipartBodyParser(request: ClientRequest): Promise<Object> {
  return new Promise((resolve: Resolve, reject: Reject) => {
    const form = new IncomingForm()
 
    form.parse(request, (err, fields, files) => {
      if (err) return reject(err)
      else return resolve({
        fields,
        files,
      })
    })
  })
}

multipartBodyParser.negotiationName = /^multipart\/form-data/

module.exports = multipartBodyParser

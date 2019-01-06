// @flow

const Promise = require("bluebird")

const bodyParser = require("../body-parser")
const HttpError = require("../../../better-errors/http-error")

import type { ClientRequest } from "http"
import type { Buffer } from "buffer"

async function multipartBodyParser(request: ClientRequest): Promise<Object> {
  const body = await bodyParser(request)
  const boundary = request.headers

}

multipartBodyParser.negotiationName = /^multipart\/form-data/

module.exports = multipartBodyParser

// @flow

import type { ClientRequest } from "http"

const Promise = require("bluebird")
const multiparty = require("multiparty")

module.exports = {
  body<T>(request: ClientRequest): Promise<string> {
    let body = ""
    return new Promise((resolve, reject) => {
      request
        .on("data", (chunk: string) => {
          body += chunk

          if (body.length > 2e+6)
            reject({
              code: 413,
            })
        })
        .on("end", () => {
          const form = new multiparty.Form()

          form.parse(request, (error, fields, files) => {
            if (error)
              reject({
                code: 400,
                error
              })
            else
              resolve({
                fields,
                files,
              })
          })
        })
    })
  }
}

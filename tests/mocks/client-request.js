// @flow

class ClientRequest {
  url: string
  method: string
  body: string

  constructor(options: Object = {}) {
    this.url = options.url
    this.method = options.method
    this.body = options.body
  }
}

module.exports = ClientRequest

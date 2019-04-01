import { Multicolour$RequestParserArgs } from "@mc-types/multicolour/route"

export class Multicolour$ContentNegotiator {

  public async parseResponse(reply: any): Promise<any> {
    // tslint:disable-next-line:max-line-length
    console.warn("This is the default parseResponse function. Did you forget to specify your own parseResponse(reply: any) function to parse this response?")
    return JSON.stringify(reply)
  }

  public async parseBody(body: Multicolour$RequestParserArgs): Promise<any> {
    // tslint:disable-next-line:max-line-length
    console.warn("This is the default parseBody function. Did you forget to specify your own parseBody(body: Multicolour$RequestParserArgs) function to parse this request's body?")
    return body
  }
}


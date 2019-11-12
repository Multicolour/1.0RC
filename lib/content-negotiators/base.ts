import { MulticolourResponseParserArgs } from "@mc-types/multicolour/reply"
import { MulticolourRequestParserArgs } from "@mc-types/multicolour/route"

export class MulticolourContentNegotiator {
  public async parseResponse(
    config: MulticolourResponseParserArgs,
  ): Promise<any> {
    console.error(
      "This is the default parseResponse function. Did you forget to specify your own parseResponse(reply: any) function to parse this response?",
    )
    return JSON.stringify(config.reply)
  }

  public async parseBody(config: MulticolourRequestParserArgs): Promise<any> {
    console.error(
      "This is the default parseBody function. Did you forget to specify your own parseBody(body: Multicolour$RequestParserArgs) function to parse this request's body?",
    )
    return Promise.reject(config.request)
  }
}

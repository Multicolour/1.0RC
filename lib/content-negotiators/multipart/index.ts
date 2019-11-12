import { MulticolourResponseParserArgs } from "@mc-types/multicolour/reply"
import { MulticolourRequestParserArgs } from "@mc-types/multicolour/route"
import { MulticolourContentNegotiator } from "../base"

export default class MultipartContentNegotiator extends MulticolourContentNegotiator {
  public async parseBody(
    args: MulticolourRequestParserArgs,
  ): Promise<Record<string, any>> {
    return Promise.reject(
      new ReferenceError(
        "You should implement the parseBody method of your Content Negotiator: " +
          JSON.stringify(args),
      ),
    )
  }

  public async parseResponse(config: MulticolourResponseParserArgs) {
    return JSON.stringify(config.reply)
  }
}

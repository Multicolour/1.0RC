import { Multicolour$ResponseParserArgs } from "@mc-types/multicolour/reply"
import { Multicolour$RequestParserArgs } from "@mc-types/multicolour/route"
import { Multicolour$ContentNegotiator } from "../base"

export default class MultipartContentNegotiator extends Multicolour$ContentNegotiator {
  public async parseBody(args: Multicolour$RequestParserArgs): Promise<object> {

  }

  public async parseResponse(config: Multicolour$ResponseParserArgs) {
    return JSON.stringify(config.reply)
  }
}

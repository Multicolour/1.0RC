import HttpError from "@lib/better-errors/http-error"
import bodyParser from "@lib/server/request-parsers/body-parser"
import { MulticolourResponseParserArgs } from "@mc-types/multicolour/reply"
import { MulticolourRequestParserArgs } from "@mc-types/multicolour/route"
import { MulticolourContentNegotiator } from "./base"

export default class JSONContentNegotiator extends MulticolourContentNegotiator {
  public async parseBody(args: MulticolourRequestParserArgs): Promise<object> {
    return bodyParser({ request: args.request }).then((json: string) => {
      let outwardBody

      if (json[0] !== "{" && json[0] !== "[") {
        throw new HttpError({
          statusCode: 400,
          error: {
            // tslint:disable-next-line:max-line-length
            message: `Your JSON isn't structured correctly, the issue is at \nline: 0 \ncolumn: 0\n\nUnexpected "${json[0]}"`,
          },
        })
      }

      try {
        outwardBody = JSON.parse(json)
      } catch (error) {
        throw new HttpError({
          statusCode: 400,
          error: {
            message: "Invalid JSON received.",
          },
        })
      }

      return outwardBody
    })
  }

  public async parseResponse(config: MulticolourResponseParserArgs) {
    return JSON.stringify(config.reply)
  }
}

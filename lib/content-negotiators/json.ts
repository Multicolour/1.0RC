import HttpError from "@lib/better-errors/http-error"
import bodyParser from "@lib/server/request-parsers/body-parser"
import { Multicolour$RequestParserArgs } from "@mc-types/multicolour/route"
import { Multicolour$ContentNegotiator } from "./base"

export default class JSONContentNegotiator extends Multicolour$ContentNegotiator {
  public async parseBody(args: Multicolour$RequestParserArgs): Promise<object> {
    return bodyParser({ request: args.request })
    .then((json: string) => {
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

  public async parseResponse(reply: any) {
    console.log(reply)
  }
}

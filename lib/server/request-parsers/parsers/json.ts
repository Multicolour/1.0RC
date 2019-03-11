import { IncomingMessage } from "http"

import HttpError from "@lib/better-errors/http-error"
import bodyParser from "../body-parser"

async function JsonParser(request: IncomingMessage): Promise<object> {
  return bodyParser({ request })
  .then((json: string) => {
    let outwardBody

    if (json[0] !== "{" && json[0] !== "[")
      throw new HttpError({
        statusCode: 400,
        error: {
          message: `Your JSON isn't structured correctly, the issue is at \nline: 0 \ncolumn: 0\n\nUnexpected "${json[0]}"`,
        },
      })

    try {
      outwardBody = JSON.parse(json)
    }
    catch (error) {
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

JsonParser.negotiationAccept = "application/json"

export default JsonParser

import HttpError from "@lib/better-errors/http-error"
import { MulticolourRequestParserArgs } from "@mc-types/multicolour/route"

async function BodyParser(
  config: MulticolourRequestParserArgs,
): Promise<string> {
  if (!config.request) {
    return Promise.reject(
      new HttpError({
        statusCode: 500,
        error: {
          message:
            // tslint:disable-next-line:max-line-length
            "The body parser was invoked without a request with which to parse. This is a developer problem, please contact the owner of this API to resolve this issue.",
        },
      }),
    )
  }

  return new Promise((resolve, reject) => {
    const body: Buffer[] = []
    const maxBodySize = config.hasOwnProperty("maxBodySize")
      ? config.maxBodySize
      : 2e7 // Max 20mb upload limit.

    let bodySize = 0

    config.request.on("data", (data: Buffer) => {
      const dataSize = Buffer.byteLength(data)

      if (maxBodySize && bodySize + dataSize > maxBodySize) {
        return reject(
          new HttpError({
            statusCode: 400,
            error: {
              message:
                // tslint:disable-next-line:max-line-length
                "Body size exceeded the maximum body size allowed on this server. Please try again with a smaller payload.",
            },
          }),
        )
      }

      bodySize += dataSize
      body.push(data)
    })

    config.request.on("end", () => resolve(body.toString()))
  })
}

export default BodyParser

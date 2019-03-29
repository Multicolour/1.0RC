import { Multicolour$ContentNegotiator } from "@mc-types/multicolour/content-negotiation"
import { Multicolour$RequestParserArgs } from "@mc-types/multicolour/route"
import {
  Fields,
  Files,
  IncomingForm,
} from "formidable"

class MultipartBodyParser implements Multicolour$ContentNegotiator {

  public async parseBody(args: Multicolour$RequestParserArgs): Promise<object> {
    return new Promise((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(args.request, (err: any, fields: Fields, files: Files) => {
        if (err) {
          return reject(err)
        }

        return resolve({
          fields,
          files,
        })
      })
    })
  }
}

export default MultipartBodyParser

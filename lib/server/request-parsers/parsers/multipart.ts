import { Multicolour$RequestParserArgs } from "@mc-types/multicolour/route"
import {
  Fields,
  Files,
  IncomingForm,
} from "formidable"

async function multipartBodyParser(args: Multicolour$RequestParserArgs): Promise<object> {
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

multipartBodyParser.negotiationName = /^multipart\/form-data/

export default multipartBodyParser

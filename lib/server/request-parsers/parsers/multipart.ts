import { 
  IncomingForm,
  Fields,
  Files
} from "formidable"
import { Multicolour$RequestParserArgs } from "@mc-types/multicolour/route"

async function multipartBodyParser(args: Multicolour$RequestParserArgs): Promise<object> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm()
 
    form.parse(args.request, (err: any, fields: Fields, files: Files) => {
      if (err) return reject(err)
      else return resolve({
        fields,
        files,
      })
    })
  })
}

multipartBodyParser.negotiationName = /^multipart\/form-data/

export default multipartBodyParser

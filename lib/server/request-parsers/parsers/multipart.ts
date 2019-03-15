import { IncomingMessage} from "http"
import { IncomingForm } from "formidable"

async function multipartBodyParser(request: IncomingMessage): Promise<object> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm()
 
    form.parse(request, (err, fields, files) => {
      if (err) return reject(err)
      else return resolve({
        fields,
        files,
      })
    })
  })
}

multipartBodyParser.negotiationName = /^multipart\/form-data/

module.exports = multipartBodyParser

import { Multicolour$ResponseParserArgs } from "@mc-types/multicolour/reply"
import { Multicolour$RequestParserArgs } from "@mc-types/multicolour/route"
import {
  Fields,
  Files,
  IncomingForm,
} from "formidable"
import { Multicolour$ContentNegotiator } from "../base"

export default class MultipartContentNegotiator extends Multicolour$ContentNegotiator {
  public async parseBody(args: Multicolour$RequestParserArgs): Promise<object> {
    return new Promise((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(args.request, (err: any, fields: Fields, files: Files) => {
        if (err) {
          return reject(err)
        }

        return resolve({
          ...fields,
          ...files,
        })
      })
    })
  }

  public async parseResponse(config: Multicolour$ResponseParserArgs) {
    return JSON.stringify(config.reply)
  }
}

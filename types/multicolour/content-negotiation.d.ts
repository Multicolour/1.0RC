import { Multicolour$RequestParserArgs } from "@mc-types/multicolour/route"

export class Multicolour$ContentNegotiator {
  public parseBody: (body: Multicolour$RequestParserArgs) => Promise<any>
}


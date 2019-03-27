export class Multicolour$ContentNegotiatorClass {
  public parseBody: (body: string) => Promise<any>
}

export function Multicolour$ContentNegotiatorFunction(body: string): Promise<any>

export type Multicolour$ContentNegotiator = Multicolour$ContentNegotiatorClass
  | Multicolour$ContentNegotiatorFunction

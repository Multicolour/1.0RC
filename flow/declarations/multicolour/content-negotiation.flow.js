// @flow

export interface Multicolour$ContentNegotiatorClass<NegotiatorReturnType = {
  parseBody(body: string): Promise<NegotiatorReturnType>
}

export type Multicolour$ContentNegotiatorFunction<NegotiatorReturnType> = (body: string) => Promise<NegotiatorReturnType>

export type Multicolour$ContentNegotiator = Multicolour$ContentNegotiatorClass | Multicolour$ContentNegotiatorFunction

export class Multicolour$ContentNegotiatorClass<NegotiatorReturnType> {
  parseBody: (body: string) => Promise<NegotiatorReturnType>;
}

export function Multicolour$ContentNegotiatorFunction<NegotiatorReturnType>(body: string): Promise<NegotiatorReturnType>

export type Multicolour$ContentNegotiator<NegotiatorReturnType> = Multicolour$ContentNegotiatorClass<NegotiatorReturnType> | Multicolour$ContentNegotiatorFunction<NegotiatorReturnType>

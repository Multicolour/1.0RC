// @flow

import type { Multicolour$RouteVerbs } from "@flow/multicolour/route.flow"

/**
 * Each attribute has to have a type, here are the
 * types that Multicolour supports at the moment.
 * @type {string}
 */
export type Multicolour$ModelAttributeType = 
  // Integers/floats/numbers.
  "smallInt" // signed
  | "mediumInt" | "integer" // signed
  | "bigInt" // signed
  | "numeric" // unsigned
  | "double"
  | "float"
  | "bit"

  | "boolean"
  
  // dates.
  | "date"
  | "time"
  | "datetime"
  | "timestamp" // includes a timezone

  // Text/binary.
  | "text"
  | "blob"
  | "json"
  | "bytearray"

export type Multicolour$ModelAttribute = {
  // The type of the database column.
  type: Multicolour$ModelAttributeType,

  // Whether this attribute is required to exist or not.
  required?: boolean,

  // A description of this attribute, used in the documentation
  // page to help consumers understand the attribute's purpose.
  description?: string,

  // Tags to be used in the documentation to help with filtering
  // certain endpoints and categories together.
  tags?: string[],
}

export type Multicolour$ConstraintTarget = string
  | number
  | async (request: IncomingMessage) => Promise<string | number>,

export type Multicolour$ConstraintDefinition = {
  // The verbs this constraint has an affect on.
  verbs: Multicolour$RouteVerbs[],

  // The constraint target which is added to the query overriding any incoming vales.
  constraint: Multicolour$ConstraintTarget,
}

export type Multicolour$Model<ModelAttributes = Object> = {
  columns: {  
    [attribute: string]: Multicolour$ModelAttribute,
  },
  constraints: {
    [column: string]: Multicolour$ConstraintDefinition
  },
  toJSON: async (row: ModelAttributes) => Promise<{ ...ModelAttributes }>
}

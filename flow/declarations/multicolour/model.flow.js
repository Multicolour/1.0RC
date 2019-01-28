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
  tags?: Array<string>
}

export type Multicolour$ModelConstraint = {
  // The verbs this constraint has an affect on.
  verbs: Multicolour$RouteVerbs[],
}

export type Multicolour$Model = {
  [attribute: string]: Multicolour$ModelAttribute,
}

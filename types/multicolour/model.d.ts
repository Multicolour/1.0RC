// @flow

import type { IncomingMessage } from "http"
import type { 
  Multicolour$RouteVerbs,
  Multicolour$RouteSpecificsConfig,
} from "@flow/multicolour/route.flow"

/**
 * Each attribute has to have a type, here are the
 * types that Multicolour supports at the moment.
 * @type {string}
 */
export type Multicolour$ModelAttributeType = 
  // Integers/floats/numbers.
  "smallInt" // signed
  | "mediumInt" // signed
  | "integer" // signed
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

/**
 * Each model has at least one column
 * and each column can be configured for
 * requirement, docs and etcetera.
 */
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
  | boolean
  | (request: IncomingMessage) => Promise<string | number | boolean>

export type Multicolour$ConstraintDefinition = {
  // The verbs this constraint has an affect on.
  verbs: Multicolour$RouteVerbs[],

  // The constraint target which is added to the query overriding any incoming vales.
  constraint: Multicolour$ConstraintTarget,
}

export type Multicolour$ModelRouteConfig = {
  [verb: Multicolour$RouteVerbs]: Multicolour$RouteSpecificsConfig,
}

export type Multicolour$Model<ModelAttributes = Object> = {
  columns: {  
    [attribute: string]: Multicolour$ModelAttribute,
  },
  services?: string[],
  database?: string,
  routeConfig?: Multicolour$ModelRouteConfig,
  constraints?: {
    [column: string]: Multicolour$ConstraintDefinition
  },
  toJSON?: (row: ModelAttributes) => Promise<{ ...ModelAttributes }>,
}

export type Multicolour$ModelsObject = {
  [modelName: string]: Multicolour$Model<*>,
}

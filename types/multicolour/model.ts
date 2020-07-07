import {
  MulticolourRouteSpecificsConfig,
  MulticolourRouteVerbs,
} from "@mc-types/multicolour/route"
import { IncomingMessage } from "http"

/**
 * Each attribute has to have a type, here are the
 * types that Multicolour supports at the moment.
 * @type {string}
 */
export type MulticolourModelAttributeType =
  | "smallInt" // signed
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
export interface MulticolourModelAttribute {
  // The type of the database column.
  type: MulticolourModelAttributeType

  // Whether this attribute is required to exist or not.
  required?: boolean

  // A description of this attribute, used in the documentation
  // page to help consumers understand the attribute's purpose.
  description?: string

  // Tags to be used in the documentation to help with filtering
  // certain endpoints and categories together.
  tags?: string[]
}

export type MulticolourConstraintTargetCallback = (
  request: IncomingMessage,
) => Promise<unknown>

export type MulticolourConstraintTarget =
  | string
  | number
  | boolean
  | MulticolourConstraintTargetCallback

export interface MulticolourConstraintDefinition {
  // The verbs this constraint has an affect on.
  verbs: MulticolourRouteVerbs[]

  // The constraint target which is added to the query overriding any incoming vales.
  constraint: MulticolourConstraintTarget
}

export type MulticolourModelRouteConfig = {
  [key in MulticolourRouteVerbs]: MulticolourRouteSpecificsConfig
}

export interface MulticolourModel<ModelAttributes = Record<string, unknown>> {
  columns: {
    [attribute: string]: MulticolourModelAttribute
  }
  services?: string[]
  database?: string
  routeConfig?: MulticolourModelRouteConfig
  constraints?: {
    [column: string]: MulticolourConstraintDefinition
  }
  toJSON?: (row: ModelAttributes) => Promise<ModelAttributes>
}

export interface MulticolourModelsObject<AllModels> {
  [modelName: string]: MulticolourModel<AllModels>
}

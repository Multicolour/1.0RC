// @flow

export type JSONSchemaMetaReference = {
  [propertyName: string]: JSONSchema,
}

export type JSONSchema = {
  id?: string,
  $ref?: string,
  $schema?: string,
  title?: string,
  description?: string,
  default?: *,
  required?: string[],
  properties?: JSONSchemaMetaReference,
  minProperties?: number,
  maxProperties?: number,
  definitions?: JSONSchemaMetaReference,
  patternProperties?: {
    [propertyName: RegExp]: JSONSchema,
  },

}

// @flow

export interface JSONSchemaMetaReference {
  [propertyName: string]: JSONSchema,
}

export interface JSONSchema {
  id?: string,
  $ref?: string,
  $schema?: string,
  title?: string,
  description?: string,
  default?: any,
  required?: string[],
  properties?: JSONSchemaMetaReference,
  minProperties?: number,
  maxProperties?: number,
  definitions?: JSONSchemaMetaReference,
  patternProperties?: {
    [propertyName: string]: JSONSchema,
  },

}

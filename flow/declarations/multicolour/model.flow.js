// @flow

declare type Multicolour$ModelAttribute = {
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

declare type Multicolour$ModelConstraint = {
  // The verbs this constraint has an affect on.
  verbs: Array<Multicolour$HTTPVerb>,
}

declare type Multicolour$Model = {
  [attribute: string]: Multicolour$ModelAttribute,
}

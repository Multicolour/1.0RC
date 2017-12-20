// @flow

declare type JSONAPI$AcceptHeader = "application/vnd.api+json"

declare type JSONAPI$MetaObject = {
  [key: string]: any,
}

declare type JSONAPI$Link = string | {
  href: string,
  meta?: JSONAPI$MetaObject,
}

declare type JSONAPI$LinksObject = {
  [key: string]: JSONAPI$Link,
}

declare type JSONAPI$Data<Model> = {
  id?: string | number,
  attributes: $Enum<Model>,
  type: string,
}

declare type JSONAPI$JSONAPIObject = {
  version: string,
  meta?: JSONAPI$MetaObject,
}

declare type JSONAPI<Model> = {
  /**
   * Optional meta object to contain non-JSONAPI standard
   * properties that pertain to this resource or API.
   */
  meta?: JSONAPI$MetaObject,

  /**
   * A JSONAPI object that specifies the version of JSONAPI
   * this API supports. Is optional.
   */
  jsonapi?: JSONAPI$JSONAPIObject,

  /**
   * The actual data object containing the resources
   * requested by the API.
   */
  data: ?JSONAPI$Data<Model> | ?Array<JSONAPI$Data<Model>>,
}

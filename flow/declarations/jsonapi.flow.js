// @flow

declare type JSONAPI$MetaObject = {
  [key: string]: any,
}

declare type JSONAPI$Link = string | {
  href: string,
  meta?: JSONAPI$MetaObject,
}

declare type JSONAPI$Data<Model> = {
  id?: string | number,
  attributes: $Enum<Model>,
  type: string,

}

declare type JSONAPI<Model> = {
  data: JSONAPI$Data<Model> | Array<JSONAPI$Data<Model>>,
}

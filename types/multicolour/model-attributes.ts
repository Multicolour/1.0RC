export namespace Multicolour$ModelAttribute {
  interface IntegerRange<Min, Max> {
    min: Min,
    max: Max,
  }

  interface Relationship<To> {
    hasMany?: To,
    hasOne?: To,
  }

}

export interface IntegerRange<Min, Max> {
  min: Min,
  max: Max,
}

export interface Relationship<To> {
  hasMany?: To,
  hasOne?: To,
}


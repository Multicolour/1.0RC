// @flow

export type Multicolour$DatabaseConnectionConfig = {
  adapter: string,
  host?: string,
  port?: number,
  username?: string,
  password?: string,
}

export type Multicolour$APIServiceConfig = {

}

export type Multicolour$ServiceGroup = {
  [key: string]: Multicolour$SingleDatabaseConnectionConfig | Multicolour$APIServiceConfig,
}

// Config structure.
export type Multicolour$Config = {
  models: string,
  
  services: Multicolour$ServiceGroup,
}

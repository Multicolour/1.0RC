// @flow

export type Multicolour$ServiceBaseConfig = {
  type: "database" | "api"
  dependsOn: string[],
}

export type Multicolour$DatabaseConnectionConfig = {
  ...$Exact<Multicolour$ServiceBaseConfig>,
  adapter: string,
  host?: string,
  port?: number,
  username?: string,
  password?: string,
}

export type Multicolour$APIServiceConfig = {
  ...$Exact<Multicolour$ServiceBaseConfig>,
  bindHost: string,
  bindPort: number,
}

export type Multicolour$ServiceGroup = {
  [key: string]: Multicolour$SingleDatabaseConnectionConfig | Multicolour$APIServiceConfig,
}

// Config structure.
export type Multicolour$Config = {
  models: string,
  
  services: Multicolour$ServiceGroup,
}

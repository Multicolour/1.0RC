// @flow

export type APIServiceConfig = {
  host?: string,
  port?: number,
  rootUri?: string,
  security: 
}

export type DBServiceConfig = {
  host?: string,
  port?: number,

}

export type ServiceDeclaration = {
  // The type of config this is.
  type: "api" | "database",

  // Other services this service depends on.
  dependsOn: string,

  // The config for this service.
  config: APIServiceConfig | DBServiceConfig,
}

export type Config = {
  // The config version to use. Optional.
  version?: "1.0",

  services: {
    [key: string]: ServiceDeclaration,
  }
}

// @flow

export type APIServiceAuthProviderConfig = {
  clientId: string,
  clientSecret: string,
  redirectUrls: string[],
  secure: boolean,
  type: "basic" | "oauth" | "token",
}

export type APIServiceSecurityConfig = {
  auth: {
    masterKey: string,
    providers: {
      [providerName: string]: APIServiceAuthProviderConfig
    }
  },
  cors: {
    allowedDomains: string[],
  }
}

export type APIServiceConfig = {
  security: APIServiceSecurityConfig,

  host?: string,
  port?: 1811,
  rootUri?: string,
}

export type DBServiceConfig = {
  adapter: "pg" | "sqlite3" | "mysql" | "mysql2" | "oracle" | "mssql",

  host?: string,
  password?: string,
  port?: number,
  username?: string,
}

export type BaseServiceDeclaration = {
  // The type of config this is.
  type: "api" | "database",

  // Other services this service depends on.
  dependsOn?: string,
}

export type APIServiceDeclaration = {
  ...$Exact<BaseServiceDeclaration>,
  ...$Exact<APIServiceConfig>,
}

export type DatabaseServiceDeclaration = {
  ...$Exact<BaseServiceDeclaration>,
  ...$Exact<DBServiceConfig>,
}

export type ServiceDeclaration = APIServiceDeclaration | DatabaseServiceDeclaration

export type Multicolour$Config = {
  // The config version to use. Optional.
  version?: "1.0",

  services: {
    [key: string]: ServiceDeclaration,
  }
}

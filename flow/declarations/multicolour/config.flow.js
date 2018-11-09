// @flow

export type Multicolour$ServiceBaseConfig = {
  type: "database" | "api",
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
  host: string,
  port: number,
  rootUri?: string,
}

export type Multicolour$ServiceGroup = {
  [key: string]: Multicolour$SingleDatabaseConnectionConfig | Multicolour$APIServiceConfig,
}

// Config structure.
export type Multicolour$Config = {
  models: string,
  
  services: Multicolour$ServiceGroup,
}

export type Multicolour$APIServiceSecurityConfig = {
  auth: {
    masterKey: string,
    cors: {
      allowedDomains: string[],
    },
    providers: {
      [providerName: string]: {
        clientId: string,
        clientSecret: string,
        redirectURLs: string[],
        secure: boolean,
        technology: string,
      }
    }
  }
}

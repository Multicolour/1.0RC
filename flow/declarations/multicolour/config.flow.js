// @flow

export type Multicolour$ServiceBaseConfig = {
  type: "database" | "api",
  dependsOn?: string[],
}

export type Multicolour$APIServiceSecurityConfig = {
  auth: {
    masterKey: string,
    providers: {
      [providerName: string]: {
        clientId: string,
        clientSecret: string,
        redirectURLs: string[],
        technology: "oath" | "token",
        secure?: boolean,
      }
    },
    cors?: {
      allowedDomains: string[],
    },
  }
}

export type Multicolour$DatabaseServiceConfig = {
  ...$Exact<Multicolour$ServiceBaseConfig>,
  adapter: 
    "pg"
    | "sqlite3"
    | "mysql"
    | "mysql2"
    | "oracle"
    | "mssql",
  host?: string,
  port?: number,
  username?: string,
  password?: string,
}

export type Multicolour$APIServiceConfig = {
  ...$Exact<Multicolour$ServiceBaseConfig>,
  host?: string,
  port?: number,
  rootUri?: string,
  security?: Multicolour$APIServiceSecurityConfig,
  secureServerOptions?: {
    key?: string,
    cert?: string,
    pfx?: string,
    passphrase?: string,
  }
}

export type Multicolour$ServiceGroup = {
  [key: string]: 
    Multicolour$DatabaseServiceConfig
    | Multicolour$APIServiceConfig,
}

/**
 * The Multicolour config object,
 * restart defaults to "never".
 */
export type Multicolour$Config = {
  models: string,
  services: Multicolour$ServiceGroup,
  restart?:
    "unless-stopped"
    | "on-error"
    | "never"
}

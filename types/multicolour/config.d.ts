export interface Multicolour$ServiceBaseConfig {
  type: "database" | "api",
  dependsOn?: string[],
}

export interface Multicolour$APIServiceSecurityConfig {
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

export interface Multicolour$DatabaseServiceConfig extends Multicolour$ServiceBaseConfig {
  adapter: "pg"
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

export interface Multicolour$APIServiceConfig extends Multicolour$ServiceBaseConfig {
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

export interface Multicolour$ServiceGroup {
  [key: string]: Multicolour$DatabaseServiceConfig
    | Multicolour$APIServiceConfig,
}

/**
 * The Multicolour config object,
 * restart defaults to "never".
 */
export interface Multicolour$Config {
  models: string,
  services: Multicolour$ServiceGroup,
  restart?: "unless-stopped"
    | "on-error"
    | "never"
}

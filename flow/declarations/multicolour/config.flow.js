// @flow

/**
 * Database config structure.
 *
 * This is passed into the Multicolour core
 * and connections are configured and set up
 * prior to services being setup and started.
 */
export type Multicolour$SingleDatabaseConnectionConfig = {
  adapter: string,
  host?: string,
  port?: number,
  username?: string,
  password?: string,
}

export type Multicolour$DatabaseConnectionsConfig = {
  [name: string]: Multicolour$SingleDatabaseConnectionConfig,
}

/**
 * Service declaration structure.
 */
export type Multicolour$APIServiceDeclaration = {
  port: number,
  host?: string,
  root_uri?: string,
  security?: Multicolour$APIServiceSecurityDeclaration,
  TLSOptions?: https$HTTPSOptions,
}

export type Multicolour$APIServiceDeclarations = {
  [name: string]: Multicolour$APIServiceDeclaration,
}

export type Multicolour$APIServiceSecurityAuthDeclaration = {
  client_id: string,
  client_secret: string,
  redirect_urls: Array<string>,
  technology: "oauth" | "token",
  secure?: boolean,
}

export type Multicolour$APIServiceSecurityAuthDeclarations = {
  [name: string]: Multicolour$APIServiceSecurityAuthDeclaration,
}

export type Multicolour$APIServiceSecurityCORSDeclaration = {
  allowed_domains: Array<string>,
}

export type Multicolour$APIServiceSecurityDeclaration = {
  auth?: Multicolour$APIServiceSecurityAuthDeclarations,
  cors?: Multicolour$APIServiceSecurityCORSDeclaration
}

// Config structure.
export type Multicolour$Config = {
  models: string,
  api: Multicolour$APIServiceDeclarations,
  databases: Multicolour$DatabaseConnectionsConfig,
}

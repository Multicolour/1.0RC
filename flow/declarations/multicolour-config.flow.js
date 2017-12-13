// @flow

/**
 * Database config structure.
 *
 * This is passed into the Multicolour core
 * and connections are configured and set up
 * prior to services being setup and started.
 *
 * @type {Object}
 */
declare type Multicolour$SingleDatabaseConnectionConfig = {
  adapter: string,
  host?: string,
  port?: number,
  username?: string,
  password?: string,
}

declare type Multicolour$DatabaseConnectionsConfig = {
  [name: string]: Multicolour$SingleDatabaseConnectionConfig,
}

/**
 * Service declaration structure.
 *
 * 
 * @type {Object}
 */
declare type Multicolour$APIServiceDeclaration = {
  port: number,
  host?: string,
  root_uri?: string,
  security?: Multicolour$APIServiceSecurityDeclaration,
}

declare type Multicolour$APIServiceDeclarations = {
  [name: string]: Multicolour$APIServiceDeclaration,
}

declare type Multicolour$APIServiceSecurityAuthDeclaration = {
  client_id: string,
  client_secret: string,
  redirect_urls: Array<string>,
  technology: "oauth" | "token",
  secure?: boolean,
}

declare type Multicolour$APIServiceSecurityAuthDeclarations = {
  [name: string]: Multicolour$APIServiceSecurityAuthDeclaration,
}

declare type Multicolour$APIServiceSecurityCORSDeclaration = {
  allowed_domains: Array<string>,
}

declare type Multicolour$APIServiceSecurityDeclaration = {
  auth?: Multicolour$APIServiceSecurityAuthDeclarations,
  cors?: Multicolour$APIServiceSecurityCORSDeclaration
}

// Config structure.
declare type Multicolour$Config = {
  models: string,
  api: Multicolour$APIServiceDeclarations,
  databases: Multicolour$DatabaseConnectionsConfig,
}

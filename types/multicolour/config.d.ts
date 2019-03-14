import * as https from "https"

export interface Multicolour$ServiceBaseConfig {
  /**
   * The type of service this config describes.
   */
  type: "database" | "api",

  /**
   * What other services does this one require
   * to run, the order is irrelevant.
   */
  dependsOn?: string[],
}

export interface Multicolour$APIServiceSecurityConfig {
  /**
   * The auth config this services requires.
   */
  auth?: {
    /**
     * The master key used against all hash based security.
     * this is in addition to per user salting and hashing.
     */
    masterKey: string,

    /**
     * For each service, there can be many auth methods.
     * Providers are mechanisms for validating incoming requests.
     */
    providers: {
      /**
       * A provider defined here will have a route defined for
       * creating sessions for users and refreshing tokens.
       */
      [providerName: string]: {
        /**
         * If using an OAuth service like Facebook you can provide
         * your app or client ID here.
         */
        clientId?: string,

        /**
         * If using an OAuth service like Facebook you can provide
         * your app or client secret here.
         */
        clientSecret?: string,

        /**
         * If you want to redirect XHR or multipart/form-data requests
         * to the next page with a ?token=12345ABCDE enter the FQDN/URI here.
         * These requests infer that you send the request with the query string
         * parameter of ?redirectURL= which matches one of these entries.
         *
         * @default "return"
         */
        redirectURLs?: string[],

        /**
         * The type of auth you want to use for this provider.
         */
        technology: "oath" | "token" | "basic",

        // @TODO remove this if its not needed.
        secure?: boolean,
      }
    },
  },

  /**
   * You can specify only certain origins for requests 
   * by adding your FQDN/URIs here to be validated.
   */
  cors?: {
    allowedDomains: string[],
  },
}

export interface Multicolour$DatabaseServiceConfig 
extends Multicolour$ServiceBaseConfig {
  /**
   * The adapter this database connection will use.
   */
  adapter: "pg"
    | "sqlite3"
    | "mysql"
    | "mysql2"
    | "oracle"
    | "mssql",

  /**
   * The host this database is at.
   *
   * @default "localhost"
   */
  host?: string,

  /**
   * The port this database is on. Will default to 
   * whatever the default is for the technology,
   * I.E
   * pg: 5432
   * mysql: 3306
   * etc
   */
  port?: number,

  /**
   * The username used to auth with the database.
   *
   * @default "root"
   */
  username?: string,

  /**
   * The password to auth eith the database.
   *
   * @default ""
   */
  password?: string,
}

export interface Multicolour$APIServiceConfig extends Multicolour$ServiceBaseConfig {
  /**
   * The hostname/interface this API service will serve from.
   * Note: localhost will only listen on certain devices and
   * may cause connectivity issues on some machines.
   *
   * @default "0.0.0.0"
   */
  host?: string,

  /**
   * The port on the `host` to listen for requests on.
   * If no port supplied then; starting at 1811, ports will increment 
   * based on the number of services.
   *
   * @TJS-type integer
   * @default 1811
   */
  port?: number,

  /**
   * The external URL of this API service. I.E my-api.com
   *
   * @default ""
   */
  rootUri?: string,

  /**
   * The security config this API service requests.
   */
  security: Multicolour$APIServiceSecurityConfig,

  /**
   * All API services in production should
   * run a secure server, this is where you 
   * configure the NodeJS https module.
   */
  secureServerOptions?: https.ServerOptions,
}

export interface Multicolour$ServiceGroup {
  /**
   * Your service's definitions.
   */
  [key: string]: Multicolour$DatabaseServiceConfig
    | Multicolour$APIServiceConfig,
}

/**
 * The Multicolour config object,
 * restart defaults to "never".
 */
export interface Multicolour$Config {
  /**
   * Your service's configurations.
   */
  services: Multicolour$ServiceGroup,

  /**
   * The path to your models if not the same as your config.
   *
   * @default "./models"
   */
  models?: string,

  /**
   * When an uncaught error occurs or the service
   * unexpectedly stops the restart policy is 
   * checked. 
   *
   * Unless stopped will restart services for any reason if they exit.
   * on-error will restart your service (10 times in succession) if it exits with a return status less than 0.
   * never will keep the service down.
   *
   * @default "never"
   */
  restart?: "unless-stopped"
    | "on-error"
    | "never"
}

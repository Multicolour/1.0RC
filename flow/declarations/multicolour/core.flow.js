// @flow

import type {
  Multicolour$Config
} from "@flow/multicolour/config.flow"
import type knex from "knex"
import type http from "http"

export type Multicolour$RegisterServiceArg = {
  serviceName: string,
  serviceConfig: Multicolour$RegisteredServices,
}
export type Multicolour$Service = knex.Knex | http.Server

export type Multicolour$RegisteredServices = {
  [serviceName: string]: Multicolour$Service,
}

export type Multicolour$StateObject = {
  config: ? Multicolour$Config,
  services: ? Multicolour$RegisteredServices,
}

export type Multicolour = {
  state: Multicolour$StateObject,

  new(configPathOrObject: Multicolour$Config): void,

  registerService(service: Multicolour$RegisterServiceArg): Promise < Multicolour$Service > ,
  registerServices(): void,
}

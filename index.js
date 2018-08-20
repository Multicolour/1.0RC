// @flow

import type {
  MulticolourConfig,
  ServiceDeclaration,
} from "@flow/multicolour/config.flow"

import type {
  Multicolour,
  Multicolour$Service,
  Multicolour$RegisterServiceArg,
} from "@flow/multicolour/core.flow"

Error.stackTraceLimit = Infinity

const multicolour: Multicolour = {
  state: {
    config: null,
    services: null,
  },

  async registerService(service: Multicolour$RegisterServiceArg): Promise < Multicolour$Service > {

  },

  registerServices() {
    Object.keys(this.state.config.services)
      .map((serviceName: string) => ({
        serviceName,
        serviceConfig: this.state.config.services[serviceName]
      }))
      .map(this.registerService, this)
  },

  new(configObject: MulticolourConfig) {
    if (!configObject || !(configObject instanceof Object))
      throw new ReferenceError("No config or non-object passed into Multicolour.new(config: MulticolourConfig)")

    this.state.config = configObject

    this.registerServices()
  }
}

multicolour.new(require("./tests/content/config"))

module.exports = multicolour

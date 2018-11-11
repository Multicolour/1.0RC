// @flow


import type { Multicolour$ServiceGroup } from "../../flow/declarations/multicolour/config.flow"

const ServiceBridgeError = require("../better-errors/service-declaration-error")

const {
  Worker,
  isMainThread,
} = require("worker_threads")

class ServiceNetworkBridge {
  constructor(services: Multicolour$ServiceGroup, startOrder: string[]) {
    if (!isMainThread)
      throw new ServiceBridgeError("Attempt to create new service bridge within a sub-thread. META.", [{
        type: "bridge-on-child-thread",
        message: "Cannot create a new bridge off a sub-thread. You can only do this from the main thread. Try making a plugin and let Multicolour handle the Multi-threading of services.",
      }])

    this.startServices(services, startOrder)
  }

  startServices(services: Multicolour$ServiceGroup, startOrder: string[]) {
    return startOrder.reduce((out: { [serviceName: string]: Worker }, currentService: string) => {
      out[currentService] = new Worker(require.resolve("./service.js"), {
        workerData: services[currentService],
      })

      out[currentService].on("exit", console.error.bind(console))
      out[currentService].on("error", console.error.bind(console))
      out[currentService].on("message", console.log.bind(console))

      return out
    }, {})
  }
}

module.exports = ServiceNetworkBridge


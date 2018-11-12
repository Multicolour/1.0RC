// @flow


import type { Multicolour$ServiceGroup } from "../../flow/declarations/multicolour/config.flow"

const ServiceBridgeError = require("../better-errors/service-declaration-error")

const {
  Worker,
  isMainThread,
} = require("worker_threads")

class ServiceNetworkBridge {
  services: Multicolour$ServiceGroup
  startOrder: string[]
  
  constructor(services: Multicolour$ServiceGroup, startOrder: string[]) {
    if (!isMainThread)
      throw new ServiceBridgeError("Attempt to create new service bridge within a sub-thread. META.", [{
        type: "bridge-on-child-thread",
        message: "Cannot create a new bridge off a sub-thread. You can only do this from the main thread. Try making a plugin and let Multicolour handle the Multi-threading of services.",
      }])

    this.services = services
    this.startOrder = startOrder

    return this
  }

  startServices() {
    return this.startOrder.reduce((out: { [serviceName: string]: Worker }, currentService: string) => {
      out[currentService] = new Worker(require.resolve("./service.js"), {
        workerData: this.services[currentService],
      })

      out[currentService].on("exit", console.error.bind(console, "exit"))
      out[currentService].on("error", console.error.bind(console, "error"))
      out[currentService].on("message", console.log.bind(console, "message"))

      return out
    }, {})
  }
}

module.exports = ServiceNetworkBridge


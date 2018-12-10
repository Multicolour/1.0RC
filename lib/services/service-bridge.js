// @flow

import type { Multicolour$ServiceGroup } from "../../flow/declarations/multicolour/config.flow"
import type { Multicolour$ThreadMessage } from "../../flow/declarations/multicolour/thread-message.flow"

const ServiceBridgeError = require("../better-errors/service-declaration-error")

const Promise = require("bluebird")
const {
  Worker,
  isMainThread,
} = require("worker_threads")

class ServiceNetworkBridge {
  services: {
    [serviceName: string]: Worker,
  }
  serviceDeclarations: Multicolour$ServiceGroup
  startOrder: string[]
  
  constructor(services: Multicolour$ServiceGroup, startOrder: string[]) {
    if (!isMainThread)
      throw new ServiceBridgeError("Attempt to create new service bridge within a sub-thread. META.", [{
        type: "bridge-on-child-thread",
        message: "Cannot create a new bridge off a sub-thread. You can only do this from the main thread. Try making a plugin and let Multicolour handle the Multi-threading of services.", // eslint-disable-line max-len
      }])

    this.serviceDeclarations = services
    this.startOrder = startOrder

    return this
  }

  handleMessageFromThread(message: Multicolour$ThreadMessage): Promise<any> {
    if (!this.services.hasOwnProperty(message.serviceName))
      throw new ServiceBridgeError("Missing service dependency", [{
        type: "missing-service-dependency",
        message: `Received a request from a thread to query another service for data but the service it requested ("${message.serviceName}") doesn't exist. This usually happens when the target service has stopped running.`, // eslint-disable-line max-len
      }])
  }

  startServices() {
    this.services = this.startOrder.reduce((out: { [serviceName: string]: Worker }, currentService: string) => {
      out[currentService] = new Worker(require.resolve("./service.js"), {
        workerData: this.serviceDeclarations[currentService],
      })

      out[currentService].on("exit", console.error.bind(console, "exit"))
      out[currentService].on("error", console.error.bind(console, "error"))
      out[currentService].on("message", console.log.bind(console, "message"))

      return out
    }, {})

    return this.services
  }

  stopServices() {
    const tasks = this.startOrder
      .reverse()
      .map((serviceName: string) =>
        this.serviceDeclarations[serviceName].postMessage({
          type: "graceful-shutdown",
        })
      )

    return Promise.all(tasks)
  }
}

module.exports = ServiceNetworkBridge


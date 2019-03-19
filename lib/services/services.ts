import { Multicolour$ServiceGroup } from "../../types/multicolour/config"

import ServiceDeclarationError from "../better-errors/service-declaration-error"
import ServiceBridge from "./service-bridge"

class Services {
  public getServiceNetworkBridge(services: Multicolour$ServiceGroup, startOrder: string[]) {
    return new ServiceBridge(services, startOrder)
  }

  public validateAndSortServicesByDependencies(services: Multicolour$ServiceGroup) {
    const configuredServicesNames = Object.keys(services)

    // This will throw an error if any service has an unmet dependency.
    const missingDependencies = this.validateServicesHaveAllDependencies(services, configuredServicesNames)

    if (missingDependencies.length !== 0) {
      throw new ServiceDeclarationError("Error during service dependency resolution", missingDependencies)
    }

    // Get a topological graph of the services and sort them.
    const topologicalGraph = this.getTopologicalGraphOfServiceDependencies(services, configuredServicesNames)
    const startOrder = this.sortDependenciesTopologically(topologicalGraph)

    return startOrder
  }

  public sortDependenciesTopologically(topologicalGraph: string[][]) {
    const toposort = require("toposort")

    return toposort(topologicalGraph).reverse()
  }

  public getTopologicalGraphOfServiceDependencies(services: Multicolour$ServiceGroup, serviceNames: string[]) {
    return serviceNames
      .reduceRight((topology: string[][], serviceName: string) => {
        const dependants = services[serviceName].dependsOn

        if (dependants && dependants.length) {
          dependants.forEach((dependency: string) =>
            topology.push([ serviceName, dependency ]),
          )
        }

        return topology
      }, [])
  }

  public validateServicesHaveAllDependencies(services: Multicolour$ServiceGroup, configuredServicesNames: string[]) {
    return Object.keys(services)
      .map((serviceName: string) => {
        const service: Multicolour$ServiceGroup = services[serviceName]
        if (service.dependsOn) {
          return service.dependsOn.map((serviceDependsOnName: string) => {
            if (configuredServicesNames.indexOf(serviceDependsOnName) < 0) {
              return {
                type: "missing-dependency",
                message: `The service "${serviceName}" depends on "${serviceDependsOnName}" but there is no service by that name. Check for a spelling mistake and check cases of service names.`, // eslint-disable-line
              }
            }
          })
        }
      })
      .reduce((out: ServiceDeclarationErrorType[], currentError: ServiceDeclarationErrorType[]) =>
        out.concat(currentError)
        , [])
      .filter(Boolean)
  }
}

export default Services

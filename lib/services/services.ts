import toposort from "toposort"
import {
  MulticolourServiceGroup,
  MulticolourDatabaseServiceConfig,
  MulticolourAPIServiceConfig,
  ServiceDeclarationErrorType,
} from "@mc-types/multicolour/config"

import ServiceDeclarationError from "@lib/better-errors/service-declaration-error"
import ServiceBridge from "./service-bridge"

class Services {
  getServiceNetworkBridge(
    services: MulticolourServiceGroup,
    startOrder: string[],
  ): ServiceBridge {
    return new ServiceBridge(services, startOrder)
  }

  validateAndSortServicesByDependencies(
    services: MulticolourServiceGroup,
  ): string[] {
    const configuredServicesNames = Object.keys(services)

    // This will throw an error if any service has an unmet dependency.
    const missingDependencies = this.validateServicesHaveAllDependencies(
      services,
      configuredServicesNames,
    )

    if (missingDependencies.length !== 0) {
      throw new ServiceDeclarationError(
        "Error during service dependency resolution",
        missingDependencies,
      )
    }

    // Get a topological graph of the services and sort them.
    const topologicalGraph = this.getTopologicalGraphOfServiceDependencies(
      services,
      configuredServicesNames,
    )
    const startOrder = this.sortDependenciesTopologically(topologicalGraph)

    return startOrder
  }

  sortDependenciesTopologically(
    topologicalGraph: [string, string | undefined][],
  ): string[] {
    return toposort(topologicalGraph).reverse()
  }

  getTopologicalGraphOfServiceDependencies(
    services: MulticolourServiceGroup,
    serviceNames: string[],
  ): string[][] {
    return serviceNames.reduceRight(
      (topology: string[][], serviceName: string) => {
        const dependants = services[serviceName].dependsOn

        if (dependants && dependants.length) {
          dependants.forEach((dependency: string) =>
            topology.push([serviceName, dependency]),
          )
        }

        return topology
      },
      [],
    )
  }

  validateServicesHaveAllDependencies(
    services: MulticolourServiceGroup,
    configuredServicesNames: string[],
  ): ServiceDeclarationErrorType[] {
    return Object.keys(services)
      .map((serviceName: string) => {
        const service = services[serviceName]

        if (service.dependsOn) {
          return service.dependsOn
            .map((serviceDependsOnName: string) => {
              if (configuredServicesNames.indexOf(serviceDependsOnName) < 0) {
                return {
                  type: "missing-dependency",
                  message: `The service "${serviceName}" depends on "${serviceDependsOnName}" but there is no service by that name. Check for a spelling mistake and check cases of service names.`,
                }
              }
              return
            })
            .filter(Boolean)
        }

        return
      })
      .reduce(
        (
          out: ServiceDeclarationErrorType[],
          currentError: ServiceDeclarationErrorType[],
        ) => out.concat(currentError),
        [],
      )
      .filter(Boolean)
  }
}

export default Services

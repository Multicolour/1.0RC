// @flow

import type { Multicolour$ServiceGroup } from "../../flow/declarations/multicolour/config.flow"

const ServiceDeclarationError = require("../better-errors/service-declaration-error")

class Services {
  validateAndSortServicesByDependencies(services: Multicolour$ServiceGroup) {
    const configuredServicesNames = Object.keys(services)
    
    // This will throw an error if any service has an unmet dependency.
    this.validateServiceHasAllDependencies(services, configuredServicesNames)

    // Sort the service names by their dependencies.
    const sortedServiceNames: string[] = this.sortServiceNamesByTotalDependants()

    return {
      startOrder: new Set(sortedServiceNames),
    }
  }

  sortServiceNamesByTotalDependants(services: Multicolour$ServiceGroup, serviceNames: string[]) {
    return serviceNames
      .reduce((weightedDependencies: Object, serviceName: string) => {
        const service = services[serviceName]

        if (!service.dependsOn)
          return weightedDependencies

      }, [])
  }

  validateServiceHasAllDependencies(services: Multicolour$ServiceGroup, configuredServicesNames: string[]) {
    Object.keys(services)
      .forEach((serviceName: string) => {
        const service: Multicolour$ServiceGroup = services[serviceName]
        if (service.dependsOn)
          service.dependsOn.forEach((serviceDependsOnName: string) => {
            if (configuredServicesNames.indexOf(serviceDependsOnName) < 0)
              throw new ServiceDeclarationError("Missing service dependency", [
                {
                  type: "missing-dependency",
                  message: `The service "${serviceName}" depends on "${serviceDependsOnName}" but there is no service by that name. Check for a spelling mistake and check cases of service names.`, // eslint-disable-line
                },
              ])
          })
      })
  }
}

module.exports = Services

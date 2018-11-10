// @flow

import type { Multicolour$ServiceGroup } from "../../flow/declarations/multicolour/config.flow"

const ServiceDeclarationError = require("../better-errors/service-declaration-error")

class Services {
  validateAndSortServicesByDependencies(services: Multicolour$ServiceGroup) {
    const configuredServicesNames = Object.keys(services)
    
    // This will throw an error if any service has an unmet dependency.
    this.validateServiceHasAllDependencies(services, configuredServicesNames)
    
    // Get a topological graph of the services to sort.
    const topologicalGraph = this.getTopologicalGraphOfServiceDependencies(services, configuredServicesNames)

    console.log(topologicalGraph)
  }

  getTopologicalGraphOfServiceDependencies(services: Multicolour$ServiceGroup, serviceNames: string[]) {
    return serviceNames
      .reduceRight((topology: Array<string[]>, serviceName: string) => {
        const dependants = services[serviceName].dependsOn

        if (dependants && dependants.length)
          dependants.forEach((dependency: string) => 
            topology.push([ serviceName, dependency ])
          )
        
        return topology
      }, [])
  }

  validateServiceHasAllDependencies(services: Multicolour$ServiceGroup, configuredServicesNames: string[]) {
    Object.keys(services)
      .forEach((serviceName: string) => {
        const service: Multicolour$ServiceGroup = services[serviceName]
        if (service.dependsOn)
          service.dependsOn.forEach((serviceDependsOnName: string) => {
            if (configuredServicesNames.indexOf(serviceDependsOnName) < 0)
              console.error(new ServiceDeclarationError("Missing service dependency", [
                {
                  type: "missing-dependency",
                  message: `The service "${serviceName}" depends on "${serviceDependsOnName}" but there is no service by that name. Check for a spelling mistake and check cases of service names.`, // eslint-disable-line
                },
              ]).prettify())
            process.exit()
          })
      })
  }
}

module.exports = Services

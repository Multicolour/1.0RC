// @flow

import type { Multicolour$ServiceGroup } from "../../flow/declarations/multicolour/config.flow"

const ServiceDeclarationError = require("../better-errors/service-declaration-error")

class Services {
  validateAndSortServicesByDependencies(services: Multicolour$ServiceGroup) {
    const configuredServicesNames = Object.keys(services)
    
    // This will throw an error if any service has an unmet dependency.
    const missingDependencies = this.validateServicesHaveAllDependencies(services, configuredServicesNames)
    
    if (missingDependencies.length !== 0) {
      console.log(new ServiceDeclarationError("Error during service dependency resolution", missingDependencies).prettify())
      process.exit()
    }
    
    // Get a topological graph of the services to sort.
    const topologicalGraph = this.getTopologicalGraphOfServiceDependencies(services, configuredServicesNames)

    console.log(topologicalGraph)
    console.log(this.sortDependenciesTopologically(topologicalGraph))
  }

  sortDependenciesTopologically(topologicalGraph: string[][]) {
    const toposort = require("toposort")

    return toposort(topologicalGraph).reverse()
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

  validateServicesHaveAllDependencies(services: Multicolour$ServiceGroup, configuredServicesNames: string[]) {
    return Object.keys(services)
      .map((serviceName: string) => {
        const service: Multicolour$ServiceGroup = services[serviceName]
        if (service.dependsOn)
          return service.dependsOn.map((serviceDependsOnName: string) => {
            if (configuredServicesNames.indexOf(serviceDependsOnName) < 0)
              return {
                type: "missing-dependency",
                message: `The service "${serviceName}" depends on "${serviceDependsOnName}" but there is no service by that name. Check for a spelling mistake and check cases of service names.`, // eslint-disable-line
              }
          })
      })
      .reduce((out: ServiceDeclarationErrorType[][], currentError: ServiceDeclarationErrorType[]) => 
        out.concat(currentError)
      , [])
      .filter(Boolean)
  }
}

module.exports = Services

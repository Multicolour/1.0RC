// @flow

import type { 
  Multicolour$Route,
  Multicolour$StaticRouteDictionary,
} from "../../flow/declarations/multicolour/route.flow"

const { METHODS } = require("http")

class Router {
  routes: Multicolour$Route[]
  radixRouteGraph: Object
  staticRouteDictionary: Multicolour$StaticRouteDictionary

  constructor(routes: Multicolour$Route[]) {
    this.routes = routes
    this.staticRouteDictionary = Object.keys(METHODS).reduce((out: Multicolour$StaticRouteDictionary, method: string) => {
      out[method] = {}
      return out
    }, {})

  }

  route(routes: Multicolour$Route[] = []) {
    this.routes.concat(routes)

    return this
  }

  buildStaticRouteDictionary() {
    this.staticRouteDictionary = this.routes.reduce((staticRoutes: Multicolour$StaticRouteDictionary, currentRoute: Multicolour$Route): Multicolour$StaticRouteDictionary => {
      if (!currentRoute.path.search(":"))
        staticRoutes[currentRoute.method] = currentRoute
      return staticRoutes
    }, {})
  }

  buildRadixRouteGraph() {

  }

  match(method: $Keys<METHOD>, path: string) {
    if (path.search(":"))
      return this.staticRouteDictionary[method][path]
  }
}

module.exports = Router

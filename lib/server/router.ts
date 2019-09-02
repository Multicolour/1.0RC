import {
  Multicolour$Route,
  Multicolour$RouteVerbs,
} from "@mc-types/multicolour/route"

import RouterError from "@lib/better-errors/router-error"
import RadixTrie from "./radix-trie"

export interface Tries {
  [Multicolour$RouteVerbs.GET]: RadixTrie
  [Multicolour$RouteVerbs.POST]: RadixTrie
  [Multicolour$RouteVerbs.PATCH]: RadixTrie
  [Multicolour$RouteVerbs.PUT]: RadixTrie
  [Multicolour$RouteVerbs.DELETE]: RadixTrie
  [Multicolour$RouteVerbs.HEAD]: RadixTrie
  [Multicolour$RouteVerbs.OPTIONS]: RadixTrie
}

class Router {
  public tries: Tries = {
    [Multicolour$RouteVerbs.GET]: new RadixTrie(),
    [Multicolour$RouteVerbs.POST]: new RadixTrie(),
    [Multicolour$RouteVerbs.PATCH]: new RadixTrie(),
    [Multicolour$RouteVerbs.PUT]: new RadixTrie(),
    [Multicolour$RouteVerbs.DELETE]: new RadixTrie(),
    [Multicolour$RouteVerbs.HEAD]: new RadixTrie(),
    [Multicolour$RouteVerbs.OPTIONS]: new RadixTrie(),
  }

  public on(method: Multicolour$RouteVerbs, route: Multicolour$Route) {
    try {
      this.tries[method].addRoute(route.path, route.handler)
    } catch (error) {
      throw new RouterError(error)
    }
    return this
  }

  public GET(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.GET, route)
  }

  public POST(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.POST, route)
  }

  public PATCH(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.PATCH, route)
  }

  public PUT(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.PUT, route)
  }

  public DELETE(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.DELETE, route)
  }

  public HEAD(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.HEAD, route)
  }

  public OPTIONS(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.OPTIONS, route)
  }

  public match(method: Multicolour$RouteVerbs, path?: string) {
    if (typeof path !== "string" || path.length === 0) {
      return false
    }

    return this.tries[method].search(path)
  }
}

export default Router

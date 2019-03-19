import {
  Multicolour$Route,
  Multicolour$RouteVerbs,
} from "@mc-types/multicolour/route"

import RouterError from "@lib/better-errors/router-error"
import RadixTrie from "./radix-trie"

export interface Tries {
  [Multicolour$RouteVerbs.GET]: RadixTrie,
  [Multicolour$RouteVerbs.POST]: RadixTrie,
  [Multicolour$RouteVerbs.PATCH]: RadixTrie,
  [Multicolour$RouteVerbs.PUT]: RadixTrie,
  [Multicolour$RouteVerbs.DELETE]: RadixTrie,
  [Multicolour$RouteVerbs.HEAD]: RadixTrie,
  [Multicolour$RouteVerbs.OPTIONS]: RadixTrie,
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

  public get(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.GET, route)
  }

  public post(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.POST, route)
  }

  public patch(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.PATCH, route)
  }

  public put(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.PUT, route)
  }

  public delete(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.DELETE, route)
  }

  public head(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.HEAD, route)
  }

  public options(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.OPTIONS, route)
  }

  public match(method: Multicolour$RouteVerbs, path: string) {
    return this.tries[method].search(path)
  }
}

export default Router

import { 
  Multicolour$Route,
  Multicolour$RouteVerbs,
} from "@mc-types/multicolour/route"

import RadixTrie from "./radix-trie"
import RouterError from "@lib/better-errors/router-error"

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
  tries: Tries = {
    [Multicolour$RouteVerbs.GET]: new RadixTrie(),
    [Multicolour$RouteVerbs.POST]: new RadixTrie(),
    [Multicolour$RouteVerbs.PATCH]: new RadixTrie(),
    [Multicolour$RouteVerbs.PUT]: new RadixTrie(),
    [Multicolour$RouteVerbs.DELETE]: new RadixTrie(),
    [Multicolour$RouteVerbs.HEAD]: new RadixTrie(),
    [Multicolour$RouteVerbs.OPTIONS]: new RadixTrie(),
  }

  on(method: Multicolour$RouteVerbs, route: Multicolour$Route) {
    try {
      this.tries[method].addRoute(route.path, route)
    }
    catch (error) {
      throw new RouterError(error)
    }
    return this
  }

  get(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.GET, route)
  }

  post(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.POST, route)
  }
  
  patch(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.PATCH, route)
  }

  put(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.PUT, route)
  }

  delete(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.DELETE, route)
  }

  head(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.HEAD, route)
  }

  options(route: Multicolour$Route) {
    return this.on(Multicolour$RouteVerbs.OPTIONS, route)
  }

  match(method: Multicolour$RouteVerbs, path: string) {
    return this.tries[method].search(path)
  }
}

export default Router

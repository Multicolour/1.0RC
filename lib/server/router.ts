import {
  MulticolourRoute,
  MulticolourRouteVerbs,
} from "@mc-types/multicolour/route"

import { CreateTrie, InsertNodeIntoTrie, SearchTrie, Node } from "./radix-trie"

export type Tries = {
  [key in MulticolourRouteVerbs]: Node<MulticolourRoute<any>>
}

class Router {
  protected tries: Tries = {
    [MulticolourRouteVerbs.GET]: CreateTrie(),
    [MulticolourRouteVerbs.POST]: CreateTrie(),
    [MulticolourRouteVerbs.PATCH]: CreateTrie(),
    [MulticolourRouteVerbs.PUT]: CreateTrie(),
    [MulticolourRouteVerbs.DELETE]: CreateTrie(),
    [MulticolourRouteVerbs.HEAD]: CreateTrie(),
    [MulticolourRouteVerbs.OPTIONS]: CreateTrie(),
  }

  public on(method: MulticolourRouteVerbs, route: MulticolourRoute<any>): this {
    InsertNodeIntoTrie(this.tries[method], route.path, route)
    return this
  }

  public GET(route: MulticolourRoute<any>): this {
    return this.on(MulticolourRouteVerbs.GET, route)
  }

  public POST(route: MulticolourRoute<any>): this {
    return this.on(MulticolourRouteVerbs.POST, route)
  }

  public PATCH(route: MulticolourRoute<any>): this {
    return this.on(MulticolourRouteVerbs.PATCH, route)
  }

  public PUT(route: MulticolourRoute<any>): this {
    return this.on(MulticolourRouteVerbs.PUT, route)
  }

  public DELETE(route: MulticolourRoute<any>): this {
    return this.on(MulticolourRouteVerbs.DELETE, route)
  }

  public HEAD(route: MulticolourRoute<any>): this {
    return this.on(MulticolourRouteVerbs.HEAD, route)
  }

  public OPTIONS(route: MulticolourRoute<any>): this {
    return this.on(MulticolourRouteVerbs.OPTIONS, route)
  }

  public match(method: MulticolourRouteVerbs, path?: string) {
    if (typeof path !== "string" || path.length === 0) {
      return false
    }

    return SearchTrie(this.tries[method], path)
  }
}

export default Router

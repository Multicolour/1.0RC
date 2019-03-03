// @flow

import type { 
  Multicolour$Route,
  Multicolour$RouteVerbs,
} from "../../flow/declarations/multicolour/route.flow"

import type { Multicolour$RadixTrieLeaf } from "./radix-trie"

const RadixTrie = require("./radix-trie")
const RouterError = require("../better-errors/router-error")

const METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
]

export type Tries = {
  [method: Multicolour$RouteVerbs]: Multicolour$RadixTrieLeaf
}

class Router {
  tries: Tries

  constructor() {
    this.tries = METHODS.reduce((tries: Tries, method: string): Tries => {
      tries[method] = new RadixTrie()
      return tries
    }, {})
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
    return this.on("GET", route)
  }

  post(route: Multicolour$Route) {
    return this.on("POST", route)
  }
  
  patch(route: Multicolour$Route) {
    return this.on("PATCH", route)
  }

  put(route: Multicolour$Route) {
    return this.on("PUT", route)
  }

  delete(route: Multicolour$Route) {
    return this.on("DELETE", route)
  }

  head(route: Multicolour$Route) {
    return this.on("HEAD", route)
  }

  options(route: Multicolour$Route) {
    return this.on("OPTIONS", route)
  }

  match(method: Multicolour$RouteVerbs, path: string) {
    return this.tries[method.toUpperCase()].search(path)
  }
}

module.exports = Router

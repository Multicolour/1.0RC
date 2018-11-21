// @flow

import type { Multicolour$Route } from "../../flow/declarations/multicolour/route.flow"

import type { Multicolour$RadixTrieLeaf } from "./radix-trie"

const { METHODS } = require("http")
const RadixTrie = require("./radix-trie")

export type Tries = {
  [method: $Keys<typeof METHODS>]: Multicolour$RadixTrieLeaf
}

class Router {
  tries: Tries

  constructor() {
    this.tries = METHODS.reduce((tries: Tries, method: string): Tries => {
      tries[method] = new RadixTrie()
      return tries
    }, {})
  }

  on(method: typeof METHODS, route: Multicolour$Route) {
    this.tries[method].addRoute(route.path, route)
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

  match(method: typeof METHODS, path: string) {
    return this.tries[method].search(path)
  }
}

module.exports = Router

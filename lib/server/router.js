// @flow

import type { 
  Multicolour$Route,
  Multicolour$StaticRouteDictionary,
} from "../../flow/declarations/multicolour/route.flow"

import type { Multicolour$RadixTrieLeaf } from "./radix-trie"

const { METHODS } = require("http")
const RadixTrie = require("./radix-trie")

export type Tries = {
  [method: $Keys<typeof METHODS>]: Multicolour$RadixTrieLeaf
}

class Router {
  tries: Tries
  constructor() {
    this.tries = Object.keys(METHODS).reduce((tries: Tries, method: string): Tries => {
      tries[method] = new RadixTrie()
      return tries
    }, {})
  }

  on(method: $Keys<METHODS>, route: Multicolour$Route) {
    this.tries[method].addRoute(route)
  }
}

module.exports = Router

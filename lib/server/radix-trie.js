// @flow

import type {
  Multicolour$Route,
  Multicolour$RouteHandler,
} from "../../flow/declarations/multicolour/route.flow"

type IntermediateTrieLeaf = {
  route: Multicolour$Route,
  pathParts: string[]
}

type Multicolour$RadixTrieLeaf = {
  path: string,
  handler: Multicolour$RouteHandler,
  children: Multicolour$RadixTrieLeaf[],
}

type Multicolour$RadixTrie = {
  branches: Multicolour$RadixTrieLeaf[],
}

class RadixGraph {
  trie: Multicolour$RadixTrie
  
  constructor(routes: Multicolour$Route[]) {
    this.trie = routes
      .filter((route: Multicolour$Route) => route.path.search(":"))
      .map(this.renderLeafableRoute, this)
      .reduce(this.parseRoutesToRadixTrie, { branches: [] })
  }

  renderLeafableRoute(route: Multicolour$Route): IntermediateTrieLeaf {
    return {
      route,
      pathParts: route.path
        .split("/")
        .filter(Boolean),
    }
  }

  parseRoutesToRadixTrie(trie: Multicolour$RadixTrie, route: Multicolour$Route): Multicolour$RadixTrie {
    const { branches } = trie

    const topLevelLeafExists = branches.find((leaf: Multicolour$RadixTrieLeaf) => leaf.path === route.pathParts[0])

    // If we haven't seen this top node before, this entire branch
    if (!topLevelLeafExists)
      branches.push({
        path: route.pathParts[0],
        handler: null,
        children: route.pathParts
          .slice(1, route.pathParts.length)
          .map((routePart: string, index: number): Multicolour$RadixTrieLeaf => ({
            path: routePart,
            children: [],
            handler: index === route.pathParts.length ? route.handler : null,
          })),
      })

    return { branches }
  }
}

module.exports = RadixGraph

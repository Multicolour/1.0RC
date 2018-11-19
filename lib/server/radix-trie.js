// @flow

import type {
  Multicolour$Route,
  Multicolour$RouteHandler,
} from "../../flow/declarations/multicolour/route.flow"

type IntermediateTrieLeaf = {
  route: Multicolour$Route,
  root: string,
  leafChildren: string[]
}

type Multicolour$RadixTrieLeaf = {
  [leafName: string]: {
    handler: Multicolour$RouteHandler,
  }
}

class RadixGraph {
  trie: Multicolour$RadixTrieLeaf
  
  /**
   * Construct a Radix Trie of the incoming
   * routes to this function.
   *
   * @param {Multicolour$Route} routes to create trie from.
   */
  constructor(routes: Multicolour$Route[]) {
    this.trie = {}

    this.trie = routes
      .filter((route: Multicolour$Route) => route.path.search(":"))
      .map(this.renderLeafableRoute, this)
      .reduce(this.routeToBranchOrLeaf.bind(this), {}) 

    console.log("FINAL TRIE:", JSON.stringify(this.trie, null, 2))
  }

  renderLeafableRoute(route: Multicolour$Route): IntermediateTrieLeaf {
    return {
      route,
      pathParts: route.path
        .split("/")
        .filter(Boolean),
    }
  }

  upsertLeafToBranch(branch: Multicolour$RadixTrieLeaf, leaf: IntermediateTrieLeaf) {
    let currentBranch = branch

    const children = leaf.pathParts.forEach((path: string) => {
      currentBranch = this.upsertLeafToBranch(currentBranch, {
        pathParts: [],
        route: {
          path,
          handler: leaf.route.handler,
          children: [],
        },
      })
    })

    return {
      ...branch,
      children,
    }
  }

  findLeafInBranch(trie: Multicolour$RadixTrieLeaf, components: string[] = []): ?Multicolour$RadixTrieLeaf {
    return components.reduce((targetTrie: Multicolour$RadixTrieLeaf, component: string): ?Multicolour$RadixTrieLeaf => {
      if (targetTrie.hasOwnProperty(component))
        return this.findLeafInBranch(targetTrie, components.slice(1, components.length))
      else
        return false
    }, trie || this.trie)
  }
}

module.exports = RadixGraph

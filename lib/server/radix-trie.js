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

type Multicolour$RadixTrie = Multicolour$RadixTrieLeaf[]

class RadixGraph {
  trie: Multicolour$RadixTrie
  
  /**
   * Construct a Radix Trie of the incoming
   * routes to this function.
   *
   * @param {Multicolour$Route} routes to create trie from.
   */
  constructor(routes: Multicolour$Route[]) {
    this.trie = [{
      path: "",
      handler: null,
      children: [],
    }]

    this.trie = routes
      .filter((route: Multicolour$Route) => route.path.search(":"))
      .map(this.renderLeafableRoute, this)
      .map(this.upsertLeafToBranch.bind(this, this.trie[0])) 
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

  findLeafInBranch(trie: Multicolour$RadixTrieLeaf[], components: string[] = []): ?Multicolour$RadixTrieLeaf {
    return trie.find((trieLeaf: Multicolour$RadixTrieLeaf) => {
      // Exit early if there's no components or no match.
      if (components.length === 0 || trieLeaf.path !== components[0]) 
        return false

      // If we have a match and there's only one component then
      // we have a match.
      if (components.length === 1 && trieLeaf.path === components[0]) 
        return true

      // If the path specifies more than 1 component (less the one we're exploring)
      // to the path and the trie leaf doesn't have any children it's safe to
      // assume there will be no match in it.
      if (components.length - 1 > 1 && !trieLeaf.children.length) 
        return false

      // Keep going until we find it or don't.
      return this.findLeafInBranch(trieLeaf.children, components.slice(1, components.length))
    })
  }
}

module.exports = RadixGraph

export interface Node<Values = Record<string, unknown>, Params = string> {
  text: string
  nodes?: Node<Values, Params>[]
  data?: Values
  params?: Params
}

export interface URI<Params = Record<string, string>> {
  uri: string
  params?: Params
}

export type DefaultNodeValues = Record<string, unknown>
export type DefaultParams = Record<string, string>

const ADICT = new Set(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""),
)

export function breakPathIntoComponents<T = URI["params"]>(
  path: string,
): URI<T> {
  if (typeof path !== "string") {
    return {
      uri: "",
    }
  } else if (path[0] !== "/") {
    path = "/" + path
  }

  const uri: URI<T> = {
    uri: escape(path),
  }
  let currentParam: T[keyof T] | null = null

  for (let i = 0, max = uri.uri.length; i < max; i++) {
    const char = path[i]
    let currentParamName

    if (!ADICT.has(char)) {
      if (char === ":" && !currentParam) {
        currentParamName = ""
        currentParam = (null as unknown) as T[keyof T]
        let j = 1
        while (ADICT.has(path[i + j])) {
          currentParamName += path[i + j]
          j++
        }

        i += (currentParamName as string).length - 1
        if (!uri.params) uri.params = {} as T
        uri.params[currentParamName as keyof T] = currentParam
        currentParamName = null
        currentParam = null
      }
    }
  }

  return uri
}

/**
 * Is the trieNode.text a match at any length of searchText?
 *
 * Example:
 *   getPrefixLengthFromNode({ text: "multi" }, "multicolour") -> 5
 *   getPrefixLengthFromNode({ text: "single" }, "multicolour") -> -1
 *
 * @param {Node} node to check for match in.
 * @param {string} searchText that we're looking for.
 * @return {number} length of the prefix.
 */
export function getPrefixLengthFromNode<
  Values = DefaultNodeValues,
  Params = DefaultParams
>(trieNode: Node<Values, Params>, searchTextUnescaped: string): number {
  let result = 0
  const searchText = escape(searchTextUnescaped)
  if (!trieNode?.text) return 0

  for (
    let maxCharIndex = trieNode.text.length;
    result < maxCharIndex;
    result++
  ) {
    if (trieNode.text[result] === ":") {
      while (ADICT.has(searchText[result + 1])) {
        result++
      }
      continue
    }

    if (trieNode.text[result] !== searchText[result]) {
      break
    }
  }

  return result
}

/**
 * Create a basic trie.
 *
 * Takes a Generic type to specify the type of the `data` attribute of this node.
 *
 * Example:
 *   CreateTrie() -> { text: "" }
 *   CreateTrie("/") -> { text: "/" }
 *
 * @param {string} root node text content.
 * @return {Node<Values>} Newly created trie.
 */
export function CreateTrie<Values, Params = DefaultParams>(
  text = "",
): Node<Values, Params> {
  return {
    text,
  }
}

/**
 * Create a new node inside the trie.
 *
 * @param {Node<Values>} trie to insert into.
 * @param {string} text to search for and add.
 * @param {Values} data to assign to the node.
 * @return {Node<Values>} updated trie.
 */
export function InsertNodeIntoTrie<
  Values = DefaultNodeValues,
  Params = DefaultParams
>(
  trie: Node<Values, Params>,
  uri: URI<Params>,
  data: Values,
  nodes: Node<Values, Params>[] = [],
): Node<Values, Params> {
  if (uri.uri.length === 0) return trie
  // If there's no nodes to insert to, safe to assume
  // we can just bung it in here and crack on. This is
  // cheaper than the following logic.
  if (!trie?.nodes || !trie.nodes?.length) {
    trie.nodes = [
      {
        text: uri.uri,
        data,
        nodes: nodes || [],
      },
    ]
    if (uri.params) {
      trie.nodes[0].params = uri.params
    }
    return trie
  }

  let insertSibling = false

  nodeLoop: for (const node of trie.nodes) {
    const prefix = getPrefixLengthFromNode<Values, Params>(node, uri.uri)

    if (prefix > 0) {
      // Split our text into (MATCH)(REMAINDER).
      const nextText = node.text.substr(0, prefix)
      const remainder = node.text.substr(prefix, node.text.length - 1)

      // Update the node, its getting split.
      node.text = nextText

      // If there's a remainder, add it as
      // the child node of this one (in the iteration)
      if (remainder.length > 0) {
        node.nodes = [
          {
            text: remainder,
            data: node.data,
            nodes: node.nodes,
          },
        ]

        delete node.data
      }

      // We won't be inserting a sibling edge,
      // we're going further into the trie.
      insertSibling = false
      InsertNodeIntoTrie(
        node,
        { ...uri, uri: uri.uri.substring(prefix) },
        data,
        node.nodes,
      )

      // We added a node to the trie, we exit here.
      break nodeLoop
    } else {
      insertSibling = true
    }
  }

  if (insertSibling)
    trie.nodes.push({
      text: uri.uri,
      data,
      nodes: [],
    })

  return trie
}

/**
 * Search a Node/Trie for a match of `search`. If no match is found,
 * returns undefined. If a match is found, will return the final node
 * that matches the search term.
 *
 * Takes a Generic type to specify the type of the `data` attribute of this node.
 *
 * @param {Node<Values>} trie to search, can be a node or an entire trie.
 * @param {string} search term to search trie for.
 * @return {Node<Values> | void} The final matching Node or undefined for no match.
 */
export function SearchTrie<Values = DefaultNodeValues, Params = DefaultParams>(
  trie: Node<Values, Params>,
  uri: URI<Params>,
): Node<Values, Params> | void {
  if (!trie.nodes || !trie.nodes.length) return undefined

  let result: Node<Values, Params> | void
  for (const node of trie.nodes) {
    const prefixLength = getPrefixLengthFromNode(node, uri.uri)

    if (prefixLength > 0) {
      if (uri.uri.length - prefixLength === 0) {
        result = node
        break
      }
      result = SearchTrie(node, {
        uri: uri.uri.substr(prefixLength, uri.uri.length),
      })
      break
    }
  }

  return result
}

/**
 * Remove a `Node` from the `trie` and recompress it.
 *
 * Takes a Generic type to specify the type of the `data` attribute of this node.
 *
 * @param {Node<Values>} trie to remove node from.
 * @param {Node<Values>} node to remove to the trie.
 * @return {Node<Values>} Updated and recompressed trie.
 */
export function RemoveNodeFromTrie<
  Values = DefaultNodeValues,
  Params = DefaultParams
>(trie: Node<Values, Params>, uri: URI<Params>): Node<Values, Params> | void {
  if (!trie.nodes || !trie.nodes.length) return undefined

  for (
    let nodeIndex = 0, max = trie.nodes.length;
    nodeIndex < max;
    nodeIndex++
  ) {
    const node = trie.nodes[nodeIndex]
    const prefixLength = getPrefixLengthFromNode<Values, Params>(node, uri.uri)

    if (prefixLength > 0) {
      if (uri.uri.length === prefixLength) {
        // If we only have 1 child; plus the one
        // we're about to remove, then we can
        // compress this trie.
        if (trie.nodes.length === 2 && typeof trie.data === "undefined") {
          const survivor = trie.nodes[!nodeIndex ? 1 : 0]
          trie.text = trie.text + survivor.text
          trie.nodes = []
          trie.data = survivor.data
        } else {
          trie.nodes.splice(nodeIndex, 1)
        }

        break
      }
      RemoveNodeFromTrie(node, {
        uri: uri.uri.substr(prefixLength, uri.uri.length),
      })
      break
    }
  }

  return trie
}

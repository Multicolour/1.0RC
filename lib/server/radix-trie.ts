export interface Node<Values = Record<string, unknown>> {
  text: string
  nodes?: Node<Values>[]
  data?: Values
  params?: Record<string, Param>
}

export interface Param {
  start: number
  end: number
  value?: string
}
export interface URI {
  uri: string
  params?: Record<string, Param>
}

const ADICT = new Set(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""),
)

export function breakPathIntoComponents(path: string): URI {
  if (typeof path !== "string") {
    return {
      uri: "",
    }
  } else if (path[0] !== "/") {
    path = "/" + path
  }

  const uri: URI = {
    uri: path,
  }
  let currentParam: null | Param = null

  for (let i = 0, max = path.length; i < max; i++) {
    const char = path[i]
    let currentParamName

    if (!ADICT.has(char)) {
      if (char === ":" && !currentParam) {
        currentParamName = ""
        currentParam = {
          start: i,
          end: i + 1,
        }
        let j = 1
        while (ADICT.has(path[i + j])) {
          currentParamName += path[i + j]
          j++
        }

        i += (currentParamName as string).length - 1
        currentParam.end = i
        if (uri.params?.toString() !== "[object Object]") uri.params = {}
        uri.params[currentParamName as string] = currentParam
        currentParamName = ""
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
 *   getPrefixLengt)hFromNode({ text: "multi" }, "multicolour") -> 5
 *   getPrefixLengthFromNode({ text: "single" }, "multicolour") -> -1
 *
 * @param {Node} node to check for match in.
 * @param {string} searchText that we're looking for.
 * @return {number} length of the prefix.
 */
export function getPrefixLengthFromNode<Values = Record<string, unknown>>(
  trieNode: Node<Values>,
  searchText: string,
): number {
  let result = 0
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
export function CreateTrie<Values>(text = ""): Node<Values> {
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
export function InsertNodeIntoTrie<Values = Record<string, unknown>>(
  trie: Node<Values>,
  uri: URI,
  data: Values,
  nodes: Node<Values>[] = [],
): Node<Values> {
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

  for (const node of trie.nodes) {
    for (
      let charIndex = 0, max = uri.uri.length, hasMatch = false;
      charIndex <= max;
      charIndex++
    ) {
      hasMatch = uri.uri[charIndex] === node.text[charIndex]
      if (hasMatch) {
        // Block and keep incrementing while we have matches.
        while (
          uri.uri[charIndex] &&
          node.text[charIndex] &&
          uri.uri[charIndex] === node.text[charIndex]
        ) {
          charIndex++
        }

        // Split our text into (MATCH)(REMAINDER).
        const nextText = node.text.substr(0, charIndex)
        const remainder = node.text.substr(charIndex, node.text.length - 1)

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

          // @TODO: delete this delete.
          // WHY: It's slow and produces an 'undefined' in the output
          // that we don't expect.
          delete node.data
        }

        InsertNodeIntoTrie(
          node,
          { ...uri, uri: uri.uri.substring(charIndex) },
          data,
          node.nodes,
        )

        // We added a node to the trie, we exit here.
        break
      } else {
        trie.nodes.push({
          text: uri.uri,
          data,
          nodes: [],
        })
        // We added a node to the trie, we exit here.
        break
      }
    }
  }

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
export function SearchTrie<Values>(
  trie: Node<Values>,
  search: string,
): Node<Values> | void {
  console.log("Finding", search, "in", trie)
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
export function RemoveNodeFromTrie<Values>(
  trie: Node<Values>,
  node: Node<Values>,
): Node<Values> {
  console.log("Removing", node, "from", trie)
  return trie
}

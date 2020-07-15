export enum NodeType {
  ROOT,
  PLAIN,
  PARAM,
  END,
}

export interface Node<Values = Record<string, unknown>> {
  text: string
  type?: NodeType
  nodes?: Array<Node<Values>>
  data?: Values
  isEnd?: boolean
}

interface Param {
  start: number
  end: number
}
interface URI {
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

  // Ignore the first / because it's guaranteed.
  for (let i = 1, max = path.length; i < max; i++) {
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
      while (
        ADICT.has(searchText[result + 1]) &&
        searchText.length < result + 1
      ) {
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
 *   CreateTrie() -> { text: "", type: NodeType.ROOT, nodes: [] }
 *
 * @param {Values} to add data to root node.
 * @return {Node<Values>} Newly created node.
 */
export function CreateTrie<Values>(): Node<Values> {
  return {
    text: "",
    type: NodeType.ROOT,
  }
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

export function InsertNodeIntoTrie<Values = Record<string, unknown>>(
  trie: Node<Values>,
  text: string,
  values: Values,
): Node<Values> {
  console.log("Inserting ", text, "with", values, "into", trie)
  return trie
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

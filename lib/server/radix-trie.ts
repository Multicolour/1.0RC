// import { Multicolour$RouteHandler } from "@mc-types/multicolour/route"

export enum NodeType {
  PLAIN,
  PARAM,
}

export interface Node<Values extends {} = {}> {
  readonly text: string,
  readonly type: NodeType,
  nodes?: Array<Node<Values>>,
  data?: Values,
}

/**
 * Is the `text` a full prefix of the `comparitor`?
 *
 * Example:
 *   isPrefix("multi", "multicolour") -> true
 *   isPrefix("monotone", "multicolour") -> false
 *
 * @param {string} text to compare as a prefix to `comparitor`
 * @param {string} comparitor text to check the prefix of against `text`
 * @return {boolean} Whether there was a prefix or not.
 */
function isPrefix(text: string, comparitor: string): boolean {
  let result = false
  for (
    let charIndex = 0,
        maxCharIndex = text.length;
    charIndex < maxCharIndex;
    charIndex++
  ) {
      if (text[charIndex] !== comparitor[charIndex]) {
        result = false
        break
      }
      else {
        result = true
      }
    }

  return result
}

/**
 * Create a basic trie, with the specified root node.
 *
 * Takes a Generic type to specify the type of the `data` attribute of this node.
 *
 * Example:
 *   CreateTrie() -> { text: "", type: NodeType.PLAIN, nodes: [] }
 *   CreateTrie("/") -> { text: "/", type: NodeType.PLAIN, nodes: [] }
 *
 * @param {string} rootText
 * @return {Node<Values>} Newly created node.
 */
export function CreateTrie<Values>(rootText: string = ""): Node<Values> {
  return {
    text: rootText,
    type: NodeType.PLAIN,
    nodes: [],
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
export function SearchTrie<Values>(trie: Node<Values>, search: string): Node<Values> | void {
  if (!trie.nodes) {
    return trie
  }

  let result: Node<Values> | void
  for (
    let nodeIndex = 0,
        maxNodeIndex = trie.nodes.length - 1;
    nodeIndex <= maxNodeIndex;
    nodeIndex++
  ) {
    const node = trie.nodes[nodeIndex]
    const cutSearch = search.slice(node.text.length, search.length)

    // If this node's text isnt a match,
    // exit this iteration.
    if (!isPrefix(node.text, search)) {
      continue
    }

    // It's a prefix, dig deeper...
    result = SearchTrie(node, cutSearch)

    // If we've run out of string, we should return what we
    // already have as our match or miss.
    if (cutSearch.length <= 0) {
      break
    }
  }

  return result
}

export function InsertNodeIntoTrie<Values>(trie: Node<Values>, text: string, values: Values): Node<Values> {
  console.log("Inserting", values, "at", text, "in", trie)
  return trie
}

export function RemoveNodeFromTrie<Values>(trie: Node<Values>, node: Node<Values>): Node<Values> {
  console.log("Removing", node, "from", trie)
  return trie
}

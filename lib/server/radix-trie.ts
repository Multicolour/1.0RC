export enum NodeType {
  ROOT,
  PLAIN,
  PARAM,
  END,
}

export interface Node<Values extends {} = {}> {
  text: string
  type?: NodeType
  nodes?: Array<Node<Values>>
  data?: Values
  isEnd?: boolean
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
export function getPrefixLengthFromNode(
  trieNode: Node,
  searchText: string,
): number {
  let result = 0
  for (
    let maxCharIndex = trieNode.text.length;
    result < maxCharIndex;
    result++
  ) {
    if (trieNode.text[result] !== searchText[result]) {
      break
    }
  }

  return result
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
  return getPrefixLengthFromNode({ text }, comparitor) > 0
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
  if (!trie.nodes) {
    return trie
  }

  let result: Node<Values> | void
  for (
    let nodeIndex = 0, maxNodeIndex = trie.nodes.length - 1;
    nodeIndex <= maxNodeIndex;
    nodeIndex++
  ) {
    const node = trie.nodes[nodeIndex]

    // If this node's text isnt a match,
    // exit this iteration and move onto
    // the next node.
    if (!isPrefix(node.text, search)) {
      continue
    }

    const cutSearch = search.slice(node.text.length, search.length)

    // It's a prefix, dig deeper...
    result = SearchTrie(node, cutSearch)

    // If we've run out of string, we
    // should return what we already
    // have as our match or miss.
    if (cutSearch.length <= 0) {
      // If we ran out of string but we didn't reach
      // the end of the target node. Reset the results.
      if (node.type !== NodeType.END) result = undefined

      break
    }
  }

  return result
}

/**
 * Insert a new entry into another Node (or root Node AKA: Trie).
 *
 * Takes a Generic type to specify the type of the `data` attribute of this node.
 * Insertion `values` *must* be the same _type_ as the generic passed into this function.
 *
 * @param {Node<Values>} trie to insert new entry into.
 * @param {string} text to insert into the `trie`
 * @param {Values} values to apply to this string within the trie.
 * @return {Node<Values>} updated node.
 */
export function InsertNodeIntoTrie<Values = string | number>(
  trie: Node<Values>,
  text: string,
  values: Values,
): Node<Values> {
  if (text.length <= 0) return trie

  let didInsert = false
  const basePrefix = getPrefixLengthFromNode(trie, text)

  if (basePrefix !== 0) trie.text = trie.text.substring(0, basePrefix)

  if (!trie.nodes || trie.nodes.length === 0) {
    trie.nodes = [
      {
        text: text.slice(basePrefix),
        type: NodeType.END,
        data: values,
      },
    ]

    return trie
  }

  for (
    let nodeIndex = 0, maxNodeIndex = trie.nodes.length;
    nodeIndex < maxNodeIndex;
    nodeIndex += 1
  ) {
    const node = trie.nodes[nodeIndex]
    const prefixLength = getPrefixLengthFromNode(node, text)
    const offset = basePrefix + prefixLength

    // Check for no match at all and move on.
    if (prefixLength === 0) continue
    else {
      didInsert = true

      // We need to split this node into two parts
      // the first part will be the original Node's
      // .text sliced at the calculated offset.
      //
      // This is the remainder. Explained below.
      const slicedNode: Node<Values> = {
        ...node,
        text: node.text.substring(offset),
      }

      // This replaces this node in the trie and
      // the remainder becomes a child node of it
      // pushing this sub-trie deeper.
      const newParentNode: Node<Values> = {
        text: node.text.substring(0, offset),
        type: NodeType.PLAIN,
        nodes: [slicedNode],
      }

      InsertNodeIntoTrie(newParentNode, text.substring(offset), values)
      trie.nodes.splice(nodeIndex, 1, newParentNode)
    }
  }

  if (!didInsert)
    trie.nodes.push({
      text,
      data: values,
      type: NodeType.END,
    })

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

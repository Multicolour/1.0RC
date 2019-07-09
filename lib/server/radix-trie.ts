// import { Multicolour$RouteHandler } from "@mc-types/multicolour/route"

function isPrefix(text: string, comparitor: string) {
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

export interface Node<Values extends {} = {}> {
  readonly text: string,
  nodes?: Array<Node<Values>>,
  data?: Values,
}

export function CreateTrie<Values>(): Node<Values> {
  return {
    text: "",
    nodes: [],
  }
}

export function SearchTrie<Values>(trie: Node<Values>, search: string): Node<Values> | void {
  if (!trie.nodes) {
    return undefined
  }

  let result: Node<Values> | void
  for (
    let nodeIndex = 0,
        maxNodeIndex = trie.nodes.length - 1;
    nodeIndex <= maxNodeIndex;
    nodeIndex++
  ) {
    const node = trie.nodes[nodeIndex]
    const cutSearch = search.slice(0, node.text.length - 1)
    // console.log("Node text", node.text)
    console.log("Search", search)
    console.log("Cut %d '%s' - '%s'", node.text.length, node.text, cutSearch)

    // If this node's text isnt a match,
    // exit this iteration.
    if (!isPrefix(node.text, search)) {
      continue
    }

    console.log("Cut length", cutSearch.length - 1)
    if (cutSearch.length === 0) {
      break
    }

    result = SearchTrie(node, cutSearch)
  }

  console.log("RESULT", result)
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

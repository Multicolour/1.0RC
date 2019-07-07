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

export interface Node<Values extends object> {
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
  let result: Node<Values> | void
  for (
    let nodeIndex = 0,
        maxChildIndex = trie.nodes.length;
    nodeIndex < maxChildIndex;
    nodeIndex++
  ) {
    const node = trie.nodes[nodeIndex]

    // If this node's text isnt a match, exit.
    if (!isPrefix(node.text, search)) {
      continue
    }

    result = SearchTrie(node, search.substring(0, node.text.length - 1))
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

import {
  CreateTrie,
  // InsertNodeIntoTrie,
  Node,
  // RemoveNodeFromTrie,
  SearchTrie,
} from "@lib/server/radix-trie"

interface TestableLeaf extends Node<TestableLeaf> {
  handler: () => Promise<any>,
}

const testData: TestableLeaf[] = [
  {
    text: "/a",
  },
  {
    text: "/",
  },
  {
    text: "/hi",
  },
  {
    text: "/contact",
  },
  {
    text: "/con",
  },
  {
    text: "/cona",
  },
  {
    text: "/no",
  },
  {
    text: "/ab",
  },
  {
    text: "/α",
  },
  {
    text: "/β",
  },
].map((node) => ({
  ...node,
  handler: () => Promise.resolve({}),
}))

const testTrieA = CreateTrie<TestableLeaf>()
testTrieA.nodes = testData.map((node: TestableLeaf) => ({ ...node, nodes: []}))

testData.forEach((node: TestableLeaf) => {
  test("Searching for " + node.text, () => {
    SearchTrie<TestableLeaf>(testTrieA, node.text)
  })
})


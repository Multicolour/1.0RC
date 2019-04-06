import PrettyErrorWithStack from "../lib/better-errors/pretty-error-with-stack"

test("Pretty error parser parses error stacks properly", () => {
  const test1Error = new PrettyErrorWithStack("test 1")
  const test1ErrorAST = test1Error.getMessageAst()

  expect(test1ErrorAST).toBeTruthy()
  expect(test1ErrorAST.message).toEqual("test 1")
  expect(test1ErrorAST.stack.length).toBeGreaterThan(0)
  expect(typeof test1Error.prettify()).toEqual("string")
})

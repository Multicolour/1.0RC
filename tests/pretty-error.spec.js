const { PrettyErrorWithStack } = require("../lib/better-errors/better-errors")

test("Pretty error parser parses error stacks properly", () => {
  const test_1_error = new PrettyErrorWithStack("test 1").get_message_ast()

  expect(test_1_error.message).toEqual("test 1")
  expect(test_1_error.stack[0].file).toContain("tests/pretty-error.spec.js")
  
})

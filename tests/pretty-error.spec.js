const { PrettyErrorWithStack } = require("../lib/better-errors/better-errors")

test("Pretty error parser parses error stacks properly", () => {
  const test_1_error = new PrettyErrorWithStack("test 1")
  const test_1_error_ast = test_1_error.get_message_ast()

  expect(test_1_error_ast).toBeTruthy()
  expect(test_1_error_ast.message).toEqual("test 1")
  expect(test_1_error_ast.stack.length).toBeGreaterThan(0)
  expect(typeof test_1_error.to_stdout()).toEqual("string")  
})

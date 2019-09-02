const { pathsToModuleNameMapper } = require("ts-jest/utils")
const { compilerOptions } = require("./tsconfig")

module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  coverageDirectory: "./coverage/",
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/tests/mocks",
    "<rootDir>/examples",
    "<rootDir>/lib/better-errors/ajv-syntax-or-reference-error.ts",
    "tests/content/uncaught-error-handlers.ts",
  ],
  setupFiles: ["./tests/content/uncaught-error-handlers.ts"],
  coverageReporters: ["lcov", "json", "html", "text"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  testPathIgnorePatterns: ["<rootDir>/tests/content", "<rootDir>/tests/mocks"],
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
}

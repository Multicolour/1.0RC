// @flow

export type ServiceDeclarationErrorType = {
  type: "dependency-missing" | "connectivity-issues",
  messages: string,
}

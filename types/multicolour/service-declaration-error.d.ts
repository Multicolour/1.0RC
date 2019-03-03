export interface ServiceDeclarationErrorType {
  type: "dependency-missing" | "connectivity-issues",
  message: string,
}

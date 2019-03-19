export interface Multicolour$ServiceDeclarationError {
  type: "dependency-missing"
    | "connectivity-issues"
    | "bridge-on-child-thread"
    | "missing-service-dependency"
message: string,
}

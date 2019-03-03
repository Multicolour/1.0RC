export interface ServiceBridgeErrorType {
  type: "bridge-on-child-thread" | "missing-service-dependency",
  message: string,
}

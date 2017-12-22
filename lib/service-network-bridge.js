// @flow

class ServiceNetworkBridge {
  /**
   * An object of services that are defined in the
   * config that this network will bridge with a 
   * thin IPC layer to enable cross service communication.
   */
  servers: ServiceNetworkBridge$Servers

  /**
   * The adapter that this network bridge will use,
   * it defaults to "IPC" which is a bundled plugin
   * as part of Multicolour but could easily be any 
   * other pub/sub inter-process communication plugin.
   */
  adapter: string

  constructor(config: Multicolour$APIServiceDeclarations) {
    
  }
}

module.exports = ServiceNetworkBridge

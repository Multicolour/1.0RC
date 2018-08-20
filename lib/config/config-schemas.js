module.exports = {
  refs: {
    serviceDeclaration: require("../../schema/config/service-declaration.json"),

    // Dependencies of the service configs.
    apiSecurity: require("../../schema/config/api-service/api-security.json"),
    authProvider: require("../../schema/config/api-service/auth-provider.json"),

    // Service configs.
    dbService: require("../../schema/config/database-service.json"),
    apiService: require("../../schema/config/api-service/api-service-config.json"),
  },

  // The actual config schema.
  configSchema: require("../../schema/config.json"),
}

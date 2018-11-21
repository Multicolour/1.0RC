// @flow

const config: Multicolour$Config = {
  models: "./models",
  services: {
    myService: {
      port: 1811,

      security: {
        cors: {
          allowedDomains: [
            "http://localhost:1811",
          ],
        },
      },
    },
    databases: {
      mysql: {
      },
    },
  },
}

module.exports = config

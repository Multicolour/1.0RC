// @flow

const config: Multicolour$Config = {
  models: "./models",
  services: {
    myService: {
      type: "a bad type of unknown unknowness",
      port: 1811,

      security: {
        cors: {
          allowedDomains: [
            "http://localhost:1811",
          ],
        },
      },
    },
  },
}

module.exports = config

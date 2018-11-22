// @flow

const config: Multicolour$Config = {
  models: "./models",
  services: {
    myService: {
      port: 1811,
      myRandomPropertyOutOfPlace: 123,
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

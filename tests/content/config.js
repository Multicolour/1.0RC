// @flow

const config: Multicolour$Config = {
  models: "./models",
  api: {
    my_service: {
      port: 1811,

      security: {
        cors: {
          allowed_domains: [
            "http://localhost:1811",
          ],
        },
      },
    },
  },
  databases: {
    mysql: {
      adapter: "mysql",
    },
  },
}

module.exports = config

// @flow

const config: Multicolour$Config = {
  models: "./models",
  api: {
    my_service: {
      port: 1811,
    },
  },
  databases: {
    mysql: {
      adapter: "mysql",
    },
  },
}

module.exports = config

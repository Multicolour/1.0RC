// @flow

const Multicolour = require("../../dist/index")

new Multicolour({
  services: {
    myPGDatabase: {
      type: "database",
      adapter: "pg",
    },

    myAuthAPI: {
      type: "api",
      dependsOn: [ "myPGDatabase" ],
      port: 1811,
    },

    myUserAPI: {
      type: "api",
      dependsOn: [ "myAuthAPI" ],
      port: 1812,
    },

    myPublicAPI: {
      type: "api",
      dependsOn: [ "myPGDatabase" ],
      port: 1813,
    },
  },
})

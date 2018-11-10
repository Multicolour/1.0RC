// @flow

const Multicolour = require("../../index")

new Multicolour({
  services: {
    myPGDatabase: {
      type: "database",
      adapter: "pg",
    },

    myAPI: {
      type: "api",
      dependsOn: [ "myDatabase" ],
      port: 1811,
    },
  },
})

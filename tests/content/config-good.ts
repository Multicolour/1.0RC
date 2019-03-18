import { Multicolour$Config } from "@mc-types/multicolour/config"

const config: Multicolour$Config = {
  models: "./models",
  services: {
    myService: {
      type: "api",
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
      type: "database",
      adapter: "mysql",
    },
  },
}

export default config

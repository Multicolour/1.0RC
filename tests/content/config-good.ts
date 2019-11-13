import { MulticolourConfig } from "@mc-types/multicolour/config"

const config: MulticolourConfig = {
  models: "./models",
  services: {
    myService: {
      type: "api",
      port: 1811,

      security: {
        cors: {
          allowedDomains: ["http://localhost:1811"],
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

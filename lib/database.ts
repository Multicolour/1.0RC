import { Multicolour$DatabaseServiceConfig } from "../types/multicolour/config"

class Database {
  constructor(config: Multicolour$DatabaseServiceConfig) {
    console.log("DB config", config)
  }
}

export default Database

import { MulticolourModelsObject } from "@mc-types/multicolour/model"

import Database from "../database"

class DatabaseService {
  public models: MulticolourModelsObject<any> = {}
  public connection?: Database
}

export default DatabaseService

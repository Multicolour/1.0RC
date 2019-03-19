import { Multicolour$ModelsObject } from "@mc-types/multicolour/model"

import Database from "../database"

class DatabaseService {
  public models: Multicolour$ModelsObject = {}
  public connection?: Database
}

export default DatabaseService

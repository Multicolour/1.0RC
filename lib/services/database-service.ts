import { Multicolour$ModelObject } from "../../types/multicolour/model.flow"

import Database from "../database"

class DatabaseService {
  models: Multicolour$ModelObject 
  connection: Database

  constructor() {

  }
}

export default DatabaseService

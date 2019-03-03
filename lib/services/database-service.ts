// @flow

import type { Multicolour$ModelObject } from "../../flow/declarations/multicolour/model.flow"

const Database = require("../database")

class DatabaseService {
  models: Multicolour$ModelObject 
  connection: Database

  constructor() {

  }
}

module.exports = DatabaseService

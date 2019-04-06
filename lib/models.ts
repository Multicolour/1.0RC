import Ajv from "ajv"
import modelConstraintSchema from "../schema/model/constraint.schema.json"
import { Multicolour$Model } from "../types/multicolour/model"

import ModelValidationError from "./better-errors/model-error"

interface Multicolour$ModelObject {
  [modelName: string]: Multicolour$Model<any>,
}

interface IntermediaryModelFileResult {
  path: string,
  name: string,
  extension: string,
}

interface ModelFileResult {
  modelName: string,
  modelConfiguration: string,
}

function validateModelAgainstSchema(model: Multicolour$Model) {
  const ajv = new Ajv()

  ajv.addSchema(modelConstraintSchema)

  const validModel = ajv.validate(require("../schema/model/model.schema.json"), model.modelConfiguration)

  if (!validModel) {
    // tslint:disable-next-line:max-line-length
    throw new ModelValidationError(`Your model "${model.modelName}" contains errors. See below for an explanation:`, ajv.errors || [])
  }

  return model
}

function getModels(path: string): Multicolour$ModelObject {
  const { readdirSync } = require("fs")
  const {
    basename,
    extname,
    resolve,
  } = require("path")

  const includePattern = /\.js$/gi
  const files = readdirSync(path)

  return files
    // Filter the files.
    .filter((path: string) => includePattern.test(path))
    // Prefix with the path.
    .map((fileName: string): string => resolve(path, fileName))
    // Construct some basic info about this model.
    .map((path: string): IntermediaryModelFileResult => ({
      path,
      name: basename(path, extname(path)),
      extension: extname(path),
    }))
    // Get the file's contents.
    .map((intermediaryModelFile: IntermediaryModelFileResult): ModelFileResult => ({
      modelName: intermediaryModelFile.name,
      modelConfiguration: require(intermediaryModelFile.path),
    }))
    .map(validateModelAgainstSchema)
    // Syntax check and parse the model.
    .reduce((models: Multicolour$ModelObject, modelFileResult: ModelFileResult): Multicolour$ModelObject => {
      models[modelFileResult.modelName] = modelFileResult.modelConfiguration
      return models
    }, {})
}

export {
  getModels,
  validateModelAgainstSchema,
}

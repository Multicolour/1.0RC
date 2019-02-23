// @flow

import type { Multicolour$Model } from "../flow/declarations/multicolour/model.flow"

const ModelValidationError = require("./better-errors/model-error")

type Multicolour$ModelObject = {
  [modelName: string]: Multicolour$Model<*>,
}

type IntermediaryModelFileResult = {
  path: string,
  name: string,
  extension: string,
}

type ModelFileResult = {
  modelName: string,
  modelConfiguration: string,
}

function validateModelAgainstSchema(model: Multicolour$Model) {
  const ajv = new (require("ajv"))()

  ajv.addSchema(require("../schema/model/constraint.schema.json"))

  const validModel = ajv.validate(require("../schema/model/model.schema.json"), model.modelConfiguration)

  if (!validModel)
    throw new ModelValidationError(`Your model "${model.modelName}" contains errors. See below for an explanation:`, ajv.errors)

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

module.exports = {
  getModels,
  validateModelAgainstSchema,
}

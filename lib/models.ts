import Ajv from "ajv"
import { readdirSync } from "fs"
import { basename, extname, resolve } from "path"
import modelSchema from "../schema/model/model.schema.json"
import modelConstraintSchema from "../schema/model/constraint.schema.json"
import { MulticolourModel } from "types/multicolour/model"

import ModelValidationError from "./better-errors/model-error"

interface MulticolourModelObject<Model> {
  [modelName: string]: MulticolourModel<Model>
}

interface IntermediaryModelFileResult {
  path: string
  name: string
  extension: string
}

interface ModelFileResult {
  modelName: string
  modelConfiguration: string
}

function validateModelAgainstSchema(model: MulticolourModel): MulticolourModel {
  const ajv = new Ajv()

  ajv.addSchema(modelConstraintSchema)

  const validModel = ajv.validate(modelSchema, model.modelConfiguration)

  if (!validModel) {
    throw new ModelValidationError(
      `Your model "${model.modelName}" contains errors. See below for an explanation:`,
      ajv.errors || [],
    )
  }

  return model
}

function getModels<AllModels>(
  path = "./models",
): MulticolourModelObject<AllModels> {
  const includePattern = /\.js$/gi
  const files = readdirSync(path)

  return (
    files
      // Filter the files.
      .filter((path: string) => includePattern.test(path))
      // Prefix with the path.
      .map((fileName: string): string => resolve(path, fileName))
      // Construct some basic info about this model.
      .map(
        (path: string): IntermediaryModelFileResult => ({
          path,
          name: basename(path, extname(path)),
          extension: extname(path),
        }),
      )
      // Get the file's contents.
      .map(
        (
          intermediaryModelFile: IntermediaryModelFileResult,
        ): ModelFileResult => ({
          modelName: intermediaryModelFile.name,
          modelConfiguration: require(intermediaryModelFile.path),
        }),
      )
      .map(validateModelAgainstSchema)
      // Syntax check and parse the model.
      .reduce(
        (
          models: MulticolourModelObject<AllModels>,
          modelFileResult: ModelFileResult,
        ): MulticolourModelObject<AllModels> => {
          models[modelFileResult.modelName] = modelFileResult.modelConfiguration
          return models
        },
        {},
      )
  )
}

export { getModels, validateModelAgainstSchema }

// @flow

import type { Resolve, Reject } from "bluebird"
import type { Multicolour$Model } from "../flow/declarations/multicolour/model.flow"

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
  modelConfiguration: Multicolour$Model,
}

const Promise = require("bluebird")

async function getModels(path: string): Multicolour$ModelObject {
  const { readDir, readFileSync } = require("fs")
  const { basename, extname } = require("path")
  const includePattern = /\.js$/gi

  return new Promise((resolve: Resolve, reject: Reject) => {
    readDir(path, (error: Error, files: string[]) => {
      if (error)
        return reject(error)

      return files
        .filter((path: string) => 
          includePattern.test(path)
        )
        .map((path: string): IntermediaryModelFileResult => ({
          path,
          name: basename(path, extname(path)),
          extension: extname(path),
        }))
        .map((intermediaryModelFile: IntermediaryModelFileResult)): ModelFileResult => {
          return readFileSync(intermediaryModelFile.path, "utf8")
        }
    })
  })
}

module.exports = {
  getModels,
}

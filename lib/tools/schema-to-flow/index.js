// @flow

const Promise = require("bluebird")

export type JSONSchemaToFlowArgs = {|
  AJV: Object,
  typeName: string,
  destination: string,
|}

async function JSONSchemaToFlow(options: JSONSchemaToFlowArgs = {}) {
  const fs = require("fs")
  const target = options.AJV._refs[""]

  const normalisedTarget = {}

  return new Promise((resolve, reject) => {
    
  })
}

module.exports = JSONSchemaToFlow

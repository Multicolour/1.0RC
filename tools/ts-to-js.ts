import {resolve} from "path"
import {readFileSync} from "fs"
import * as ts from "typescript"
import { JSONSchema7 } from "json-schema"

export function TSStatementToJSNode(statement: ts.Node) {
  console.log(statement)
  switch (statement.kind) {

  }
}

export function TS2JS(path: string) {
  const fileName = resolve(path)
  const baseSchema: JSONSchema7 = {
    "$schema": "http://json-schema.org/draft-07/schema#",
  }

  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2017,
    /*setParentNodes */ true
  )

  sourceFile.statements.map(TSStatementToJSNode)
  console.log(baseSchema)
}

TS2JS("./types/multicolour/config.d.ts")

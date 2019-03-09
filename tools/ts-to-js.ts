import {resolve} from "path"
import {readFileSync} from "fs"
import * as ts from "typescript"

export function TS2JS(path: string) {
  const fileName = resolve(path)
  const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
  }

  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2017,
    /*setParentNodes */ true
  )

  sourceFile.statements.map((statement: ts.Node) => {
    switch (statement.kind) {

    }
  })
}

TS2JS("./types/multicolour/config.d.ts")

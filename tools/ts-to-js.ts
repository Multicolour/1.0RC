import {resolve} from "path"

import * as TJS from "typescript-json-schema"

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
    required: true
}

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true
}

const program = TJS.getProgramFromFiles([resolve("../types/multicolour/config.d.ts")], compilerOptions)

// We can either get the schema for one file and one type...
const schema = TJS.generateSchema(program, "Multicolour$Config", settings)


// ... or a generator that lets us incrementally get more schemas

  /*const generator = TJS.buildGenerator(program, settings)

// all symbols
const symbols = generator.getUserSymbols()*/

console.log(schema)

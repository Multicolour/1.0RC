const Config = require("../lib/config")

const configGood = require("./content/config-good")
const configBadRequired = require("./content/config-bad/required")
const configBadAdditionalProperties = require("./content/config-bad/additional-properties")
const configBadEnum = require("./content/config-bad/enum")
const configBadMinProperties = require("./content/config-bad/min-properties")

test("Config validates and throws expected errors", () => {
  let error = false
  try {
    new Config(configGood)
  }
  catch(configError) {
    error = true
  }
  finally {
    expect(error).toEqual(false)
  }

  // Test required properties error message
  error = false
  try {
    new Config(configBadRequired)
  }
  catch(configError) {
    error = configError.prettify()
  }
  finally {
    expect(typeof error).toEqual("string")
    expect(error).toContain("requires the presence of")
  }

  // Test additionalProperties properties error message
  error = false
  try {
    new Config(configBadAdditionalProperties)
  }
  catch(configError) {
    error = configError.prettify()
  }
  finally {
    expect(typeof error).toEqual("string")
    expect(error).toContain("Data path config.services['myService'] shouldn't have the property \"myRandomPropertyOutOfPlace\"")
  }
  
  // Test enum properties error message
  error = false
  try {
    new Config(configBadEnum)
  }
  catch(configError) {
    error = configError.prettify()
  }
  finally {
    expect(typeof error).toEqual("string")
    expect(error).toContain("Property \"config.services['myService'].type\" has an incorrect value, expected a value matching one of 'api', 'database") // eslint-disable-line max-len
  }

  // Test enum properties error message
  error = false
  try {
    new Config(configBadMinProperties)
  }
  catch(configError) {
    error = configError.prettify()
  }
  finally {
    expect(typeof error).toEqual("string")
    expect(error).toContain("Property \"config.services\" requires at least '1' defined properties")
  }
})

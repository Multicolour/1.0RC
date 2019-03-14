const Config = require("../lib/config")

const configGood = require("./content/config-good")
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


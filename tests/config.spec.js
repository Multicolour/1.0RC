const Config = require("../lib/config")

const configGood = require("./content/config-good")
const configBad = require("./content/config-bad")

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

  error = false
  try {
    new Config(configBad)
  }
  catch(configError) {
    error = true
  }
  finally {
    expect(error).toEqual(true)
  }
})

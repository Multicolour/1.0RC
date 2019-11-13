import configValidator from "@lib/config"

import configBadMinProperties from "./content/config-bad/min-properties"
import configGood from "./content/config-good"

test("Config validates and throws expected errors", () => {
  let error = false
  try {
    configValidator(configGood)
  } catch (configError) {
    error = true
  } finally {
    expect(error).toEqual(false)
  }

  // Test enum properties error message
  error = false
  try {
    configValidator(configBadMinProperties)
  } catch (configError) {
    error = configError.prettify()
  }

  expect(typeof error).toEqual("string")
  expect(error).toContain(
    "Property \"config.services\" requires at least '1' defined properties",
  )
})

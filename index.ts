// Catch uncaught errors and promises to present them nicely.
import "./lib/uncaught-error-handlers"
import { MulticolourConfig } from "@mc-types/multicolour/config"
import configValidator from "@lib/config"

class Multicolour {
  private config: MulticolourConfig

  constructor(config: MulticolourConfig) {
    // Get and validate the provided config.
    try {
      this.config = configValidator(config)
    } catch (error) {
      console.error(error.prettify ? error.prettify() : error)
      process.exit(-1)
    }

    // tslint:disable-next-line:max-line-length no-console
    console.info(
      "Config syntax looks good, nice work.\nNow, on to resolving, compiling and setting up your models",
    )
  }
}

export default Multicolour

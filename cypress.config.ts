import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Code coverage disabled for CI compatibility
      // require('@cypress/code-coverage/task')(on, config)
      return config
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    setupNodeEvents(on, config) {
      // Code coverage disabled for CI compatibility
      // require('@cypress/code-coverage/task')(on, config)
      return config
    }
  },
});

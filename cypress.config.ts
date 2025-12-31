import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Always setup code coverage task
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    setupNodeEvents(on, config) {
      // Always setup code coverage task
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
    env: {
      // Pass coverage flag to tests
      coverage: process.env.CYPRESS_COVERAGE === 'true'
    }
  },
});

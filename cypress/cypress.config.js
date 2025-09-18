const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false, // Disable video recording for faster CI
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000, // Reduced timeout for faster execution
    requestTimeout: 8000,
    responseTimeout: 8000,
    numTestsKeptInMemory: 0, // Reduce memory usage
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('@cypress/grep/src/plugin')(config)
      
      // Allure plugin setup
      const allureWriter = require('@shelex/cypress-allure-plugin/writer');
      on('task', allureWriter);
      
      return config
    },
    env: {
      standard_user: 'standard_user',
      locked_out_user: 'locked_out_user',
      problem_user: 'problem_user',
      performance_glitch_user: 'performance_glitch_user',
      password: 'secret_sauce'
    },
    specPattern: 'e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'support/e2e.js'
  },
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
})

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
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

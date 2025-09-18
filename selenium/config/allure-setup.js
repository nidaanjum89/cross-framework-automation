const { allure } = require('allure-mocha/runtime');

// Initialize Allure reporting
before(function() {
  allure.writeEnvironmentInfo({
    'Browser': process.env.BROWSER || 'chrome',
    'Environment': 'CI/CD',
    'Framework': 'Selenium WebDriver',
    'Node Version': process.version
  });
});

// Set up test lifecycle hooks
beforeEach(function() {
  allure.startStep('Test Setup');
  allure.endStep();
});

afterEach(function() {
  allure.startStep('Test Cleanup');
  allure.endStep();
});

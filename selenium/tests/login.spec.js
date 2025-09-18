const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const WebDriverManager = require('../config/webdriver');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const users = require('../fixtures/users.json');

describe('Login Functionality', function() {
  let driver;
  let loginPage;
  let productsPage;

  beforeEach(async function() {
    driver = await WebDriverManager.createDriver();
    loginPage = new LoginPage(driver);
    productsPage = new ProductsPage(driver);
    await loginPage.visit();
  });

  afterEach(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  describe('Valid Login Scenarios', function() {
    it('should login successfully with standard user @smoke', async function() {
      const user = users.validUsers.standard_user;
      
      await loginPage.login(user.username, user.password);
      await productsPage.shouldBeOnProductsPage();
      await productsPage.shouldHaveProductCount(6);
    });

    it('should login successfully with performance glitch user', async function() {
      const user = users.validUsers.performance_glitch_user;
      
      await loginPage.login(user.username, user.password);
      await productsPage.shouldBeOnProductsPage();
    });

    it('should login successfully with problem user', async function() {
      const user = users.validUsers.problem_user;
      
      await loginPage.login(user.username, user.password);
      await productsPage.shouldBeOnProductsPage();
    });
  });

  describe('Invalid Login Scenarios', function() {
    it('should show error for locked out user @negative', async function() {
      const user = users.invalidUsers.locked_out_user;
      
      await loginPage.login(user.username, user.password);
      await loginPage.shouldShowErrorMessage(user.expectedError);
    });

    it('should show error for invalid credentials @negative', async function() {
      const user = users.invalidUsers.invalid_credentials;
      
      await loginPage.login(user.username, user.password);
      await loginPage.shouldShowErrorMessage(user.expectedError);
    });

    it('should show error for empty username @negative', async function() {
      const user = users.invalidUsers.empty_username;
      
      await loginPage.login(user.username, user.password);
      await loginPage.shouldShowErrorMessage(user.expectedError);
    });

    it('should show error for empty password @negative', async function() {
      const user = users.invalidUsers.empty_password;
      
      await loginPage.login(user.username, user.password);
      await loginPage.shouldShowErrorMessage(user.expectedError);
    });
  });

  describe('Mobile Login Tests', function() {
    beforeEach(async function() {
      if (driver) {
        await driver.quit();
      }
      driver = await WebDriverManager.createMobileDriver();
      loginPage = new LoginPage(driver);
      productsPage = new ProductsPage(driver);
      await loginPage.visit();
    });

    it('should login successfully on mobile viewport @mobile', async function() {
      const user = users.validUsers.standard_user;
      
      await loginPage.login(user.username, user.password);
      await productsPage.shouldBeOnProductsPage();
    });

    it('should show error message properly on mobile @mobile @negative', async function() {
      const user = users.invalidUsers.locked_out_user;
      
      await loginPage.login(user.username, user.password);
      await loginPage.shouldShowErrorMessage(user.expectedError);
    });
  });

  describe('Logout Functionality', function() {
    beforeEach(async function() {
      const user = users.validUsers.standard_user;
      await loginPage.login(user.username, user.password);
      await productsPage.shouldBeOnProductsPage();
    });

    it('should logout successfully @smoke', async function() {
      await productsPage.logout();
      await loginPage.shouldBeOnLoginPage();
    });
  });
});

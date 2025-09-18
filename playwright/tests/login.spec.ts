import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import users from '../fixtures/users.json';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.visit();
  });

  test.describe('Valid Login Scenarios', () => {
    test('should login successfully with standard user', { tag: '@smoke' }, async () => {
      const user = users.validUsers.standard_user;
      
      await loginPage.login(user.username, user.password);
      await productsPage.shouldBeOnProductsPage();
      await productsPage.shouldHaveProductCount(6);
    });

    test('should login successfully with performance glitch user', async () => {
      const user = users.validUsers.performance_glitch_user;
      
      await loginPage.login(user.username, user.password);
      await productsPage.shouldBeOnProductsPage();
    });

    test('should login successfully with problem user', async () => {
      const user = users.validUsers.problem_user;
      
      await loginPage.login(user.username, user.password);
      await productsPage.shouldBeOnProductsPage();
    });
  });

  test.describe('Invalid Login Scenarios', () => {
    test('should show error for locked out user', { tag: '@negative' }, async () => {
      const user = users.invalidUsers.locked_out_user;
      
      await loginPage.login(user.username, user.password);
      await loginPage.shouldShowErrorMessage(user.expectedError);
    });

    test('should show error for invalid credentials', { tag: '@negative' }, async () => {
      const user = users.invalidUsers.invalid_credentials;
      
      await loginPage.login(user.username, user.password);
      await loginPage.shouldShowErrorMessage(user.expectedError);
    });

    test('should show error for empty username', { tag: '@negative' }, async () => {
      const user = users.invalidUsers.empty_username;
      
      await loginPage.login(user.username, user.password);
      await loginPage.shouldShowErrorMessage(user.expectedError);
    });

    test('should show error for empty password', { tag: '@negative' }, async () => {
      const user = users.invalidUsers.empty_password;
      
      await loginPage.login(user.username, user.password);
      await loginPage.shouldShowErrorMessage(user.expectedError);
    });
  });

  test.describe('Mobile Login Tests', () => {
    test('should login successfully on mobile viewport', { tag: '@mobile' }, async ({ browser }) => {
      const context = await browser.newContext({
        ...test.info().project.use,
        viewport: { width: 375, height: 667 }
      });
      const page = await context.newPage();
      const mobileLoginPage = new LoginPage(page);
      const mobileProductsPage = new ProductsPage(page);
      
      const user = users.validUsers.standard_user;
      
      await mobileLoginPage.visit();
      await mobileLoginPage.login(user.username, user.password);
      await mobileProductsPage.shouldBeOnProductsPage();
      
      await context.close();
    });

    test('should show error message properly on mobile', { tag: '@mobile @negative' }, async ({ browser }) => {
      const context = await browser.newContext({
        ...test.info().project.use,
        viewport: { width: 375, height: 667 }
      });
      const page = await context.newPage();
      const mobileLoginPage = new LoginPage(page);
      
      const user = users.invalidUsers.locked_out_user;
      
      await mobileLoginPage.visit();
      await mobileLoginPage.login(user.username, user.password);
      await mobileLoginPage.shouldShowErrorMessage(user.expectedError);
      
      await context.close();
    });
  });

  test.describe('Logout Functionality', () => {
    test.beforeEach(async () => {
      const user = users.validUsers.standard_user;
      await loginPage.login(user.username, user.password);
      await productsPage.shouldBeOnProductsPage();
    });

    test('should logout successfully', { tag: '@smoke' }, async () => {
      await productsPage.logout();
      await loginPage.shouldBeOnLoginPage();
    });
  });
});

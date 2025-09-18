import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import users from '../fixtures/users.json';
import products from '../fixtures/products.json';

test.describe('Checkout Functionality', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    // Login, add product, and navigate to cart
    await loginPage.visit();
    const user = users.validUsers.standard_user;
    await loginPage.login(user.username, user.password);
    await productsPage.shouldBeOnProductsPage();
    
    const product = products.products[0];
    await productsPage.addProductToCart(product.name);
    await productsPage.openCart();
    await cartPage.shouldBeOnCartPage();
  });

  test.describe('Checkout Process - Step One', () => {
    test.beforeEach(async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.shouldBeOnCheckoutStepOne();
    });

    test('should complete checkout with valid information', { tag: '@smoke' }, async () => {
      const checkoutInfo = users.checkoutInfo.valid;
      
      await checkoutPage.fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldBeOnCheckoutStepTwo();
    });

    test('should show error for missing first name', { tag: '@negative' }, async () => {
      const invalidInfo = users.checkoutInfo.invalid.missingFirstName;
      
      await checkoutPage.fillCheckoutInformation(invalidInfo.firstName, invalidInfo.lastName, invalidInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldShowErrorMessage(invalidInfo.expectedError);
    });

    test('should show error for missing last name', { tag: '@negative' }, async () => {
      const invalidInfo = users.checkoutInfo.invalid.missingLastName;
      
      await checkoutPage.fillCheckoutInformation(invalidInfo.firstName, invalidInfo.lastName, invalidInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldShowErrorMessage(invalidInfo.expectedError);
    });

    test('should show error for missing postal code', { tag: '@negative' }, async () => {
      const invalidInfo = users.checkoutInfo.invalid.missingPostalCode;
      
      await checkoutPage.fillCheckoutInformation(invalidInfo.firstName, invalidInfo.lastName, invalidInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldShowErrorMessage(invalidInfo.expectedError);
    });

    test('should cancel checkout and return to cart', async () => {
      await checkoutPage.clickCancel();
      await cartPage.shouldBeOnCartPage();
    });
  });

  test.describe('Checkout Process - Step Two (Overview)', () => {
    test.beforeEach(async () => {
      const checkoutInfo = users.checkoutInfo.valid;
      await cartPage.proceedToCheckout();
      await checkoutPage.shouldBeOnCheckoutStepOne();
      await checkoutPage.fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldBeOnCheckoutStepTwo();
    });

    test('should display order summary correctly', async ({ page }) => {
      const product = products.products[0];
      
      // Verify product is displayed
      await expect(checkoutPage.cartItems).toHaveCount(1);
      await expect(page.locator('.inventory_item_name')).toContainText(product.displayName);
      
      // Verify pricing information is displayed
      await expect(checkoutPage.itemTotal).toBeVisible();
      await expect(checkoutPage.tax).toBeVisible();
      await expect(checkoutPage.total).toBeVisible();
    });

    test('should complete order successfully', { tag: '@smoke' }, async () => {
      await checkoutPage.clickFinish();
      await checkoutPage.shouldBeOnCheckoutComplete();
      await checkoutPage.shouldShowOrderComplete();
    });

    test('should calculate total correctly', async () => {
      const itemTotal = await checkoutPage.getItemTotalAmount();
      const tax = await checkoutPage.getTaxAmount();
      const total = await checkoutPage.getTotalAmount();
      
      const itemPrice = parseFloat(itemTotal.replace('Item total: $', ''));
      const taxAmount = parseFloat(tax.replace('Tax: $', ''));
      const totalAmount = parseFloat(total.replace('Total: $', ''));
      
      expect(totalAmount).toEqual(itemPrice + taxAmount);
    });
  });

  test.describe('Checkout Complete', () => {
    test.beforeEach(async () => {
      const checkoutInfo = users.checkoutInfo.valid;
      await cartPage.proceedToCheckout();
      await checkoutPage.shouldBeOnCheckoutStepOne();
      await checkoutPage.fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldBeOnCheckoutStepTwo();
      await checkoutPage.clickFinish();
      await checkoutPage.shouldBeOnCheckoutComplete();
    });

    test('should return to products page after order completion', async () => {
      await checkoutPage.clickBackHome();
      await productsPage.shouldBeOnProductsPage();
    });

    test('should reset cart after order completion', async () => {
      await checkoutPage.clickBackHome();
      await productsPage.shouldBeOnProductsPage();
      await productsPage.shouldShowCartBadge(0);
    });
  });

  test.describe('Mobile Checkout Tests', () => {
    test('should complete checkout process on mobile', { tag: '@mobile' }, async ({ browser }) => {
      const context = await browser.newContext({
        ...test.info().project.use,
        viewport: { width: 375, height: 667 }
      });
      const page = await context.newPage();
      const mobileLoginPage = new LoginPage(page);
      const mobileProductsPage = new ProductsPage(page);
      const mobileCartPage = new CartPage(page);
      const mobileCheckoutPage = new CheckoutPage(page);
      
      const user = users.validUsers.standard_user;
      const product = products.products[0];
      const checkoutInfo = users.checkoutInfo.valid;
      
      await mobileLoginPage.visit();
      await mobileLoginPage.login(user.username, user.password);
      await mobileProductsPage.addProductToCart(product.name);
      await mobileProductsPage.openCart();
      await mobileCartPage.proceedToCheckout();
      
      await mobileCheckoutPage.shouldBeOnCheckoutStepOne();
      await mobileCheckoutPage.fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await mobileCheckoutPage.clickContinue();
      await mobileCheckoutPage.shouldBeOnCheckoutStepTwo();
      await mobileCheckoutPage.clickFinish();
      await mobileCheckoutPage.shouldBeOnCheckoutComplete();
      await mobileCheckoutPage.shouldShowOrderComplete();
      
      await context.close();
    });

    test('should show validation errors on mobile', { tag: '@mobile @negative' }, async ({ browser }) => {
      const context = await browser.newContext({
        ...test.info().project.use,
        viewport: { width: 375, height: 667 }
      });
      const page = await context.newPage();
      const mobileLoginPage = new LoginPage(page);
      const mobileProductsPage = new ProductsPage(page);
      const mobileCartPage = new CartPage(page);
      const mobileCheckoutPage = new CheckoutPage(page);
      
      const user = users.validUsers.standard_user;
      const product = products.products[0];
      const invalidInfo = users.checkoutInfo.invalid.missingFirstName;
      
      await mobileLoginPage.visit();
      await mobileLoginPage.login(user.username, user.password);
      await mobileProductsPage.addProductToCart(product.name);
      await mobileProductsPage.openCart();
      await mobileCartPage.proceedToCheckout();
      
      await mobileCheckoutPage.shouldBeOnCheckoutStepOne();
      await mobileCheckoutPage.fillCheckoutInformation(invalidInfo.firstName, invalidInfo.lastName, invalidInfo.postalCode);
      await mobileCheckoutPage.clickContinue();
      await mobileCheckoutPage.shouldShowErrorMessage(invalidInfo.expectedError);
      
      await context.close();
    });
  });

  test.describe('End-to-End Checkout Flow', () => {
    test('should complete full shopping and checkout flow', { tag: '@e2e' }, async () => {
      const checkoutInfo = users.checkoutInfo.valid;
      const product1 = products.products[0];
      const product2 = products.products[1];
      
      // Go back to products and add another item
      await cartPage.continueShopping();
      await productsPage.addProductToCart(product2.name);
      await productsPage.shouldShowCartBadge(2);
      await productsPage.openCart();
      
      // Complete checkout
      await cartPage.shouldHaveItemCount(2);
      await cartPage.proceedToCheckout();
      
      await checkoutPage.shouldBeOnCheckoutStepOne();
      await checkoutPage.fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldBeOnCheckoutStepTwo();
      await checkoutPage.clickFinish();
      await checkoutPage.shouldBeOnCheckoutComplete();
      await checkoutPage.shouldShowOrderComplete();
      await checkoutPage.clickBackHome();
      
      await productsPage.shouldBeOnProductsPage();
      await productsPage.shouldShowCartBadge(0);
    });
  });
});

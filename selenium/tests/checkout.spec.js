const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const WebDriverManager = require('../config/webdriver');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const users = require('../fixtures/users.json');
const products = require('../fixtures/products.json');

describe('Checkout Functionality', function() {
  let driver;
  let loginPage;
  let productsPage;
  let cartPage;
  let checkoutPage;

  beforeEach(async function() {
    driver = await WebDriverManager.createDriver();
    loginPage = new LoginPage(driver);
    productsPage = new ProductsPage(driver);
    cartPage = new CartPage(driver);
    checkoutPage = new CheckoutPage(driver);
    
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

  afterEach(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  describe('Checkout Process - Step One', function() {
    beforeEach(async function() {
      await cartPage.proceedToCheckout();
      await checkoutPage.shouldBeOnCheckoutStepOne();
    });

    it('should complete checkout with valid information @smoke', async function() {
      const checkoutInfo = users.checkoutInfo.valid;
      
      await checkoutPage.fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldBeOnCheckoutStepTwo();
    });

    it('should show error for missing first name @negative', async function() {
      const invalidInfo = users.checkoutInfo.invalid.missingFirstName;
      
      await checkoutPage.fillCheckoutInformation(invalidInfo.firstName, invalidInfo.lastName, invalidInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldShowErrorMessage(invalidInfo.expectedError);
    });

    it('should show error for missing last name @negative', async function() {
      const invalidInfo = users.checkoutInfo.invalid.missingLastName;
      
      await checkoutPage.fillCheckoutInformation(invalidInfo.firstName, invalidInfo.lastName, invalidInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldShowErrorMessage(invalidInfo.expectedError);
    });

    it('should show error for missing postal code @negative', async function() {
      const invalidInfo = users.checkoutInfo.invalid.missingPostalCode;
      
      await checkoutPage.fillCheckoutInformation(invalidInfo.firstName, invalidInfo.lastName, invalidInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldShowErrorMessage(invalidInfo.expectedError);
    });

    it('should cancel checkout and return to cart', async function() {
      await checkoutPage.clickCancel();
      await cartPage.shouldBeOnCartPage();
    });
  });

  describe('Checkout Process - Step Two (Overview)', function() {
    beforeEach(async function() {
      const checkoutInfo = users.checkoutInfo.valid;
      await cartPage.proceedToCheckout();
      await checkoutPage.shouldBeOnCheckoutStepOne();
      await checkoutPage.fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldBeOnCheckoutStepTwo();
    });

    it('should display order summary correctly', async function() {
      const product = products.products[0];
      
      // Verify product is displayed
      await cartPage.shouldHaveItemCount(1);
      await cartPage.shouldContainItem(product.displayName);
      
      // Verify pricing information is displayed
      const itemTotal = await checkoutPage.getItemTotalAmount();
      const tax = await checkoutPage.getTaxAmount();
      const total = await checkoutPage.getTotalAmount();
      
      expect(itemTotal).to.not.be.empty;
      expect(tax).to.not.be.empty;
      expect(total).to.not.be.empty;
    });

    it('should complete order successfully @smoke', async function() {
      await checkoutPage.clickFinish();
      await checkoutPage.shouldBeOnCheckoutComplete();
      await checkoutPage.shouldShowOrderComplete();
    });

    it('should calculate total correctly', async function() {
      const itemTotal = await checkoutPage.getItemTotalAmount();
      const tax = await checkoutPage.getTaxAmount();
      const total = await checkoutPage.getTotalAmount();
      
      const itemPrice = parseFloat(itemTotal.replace('Item total: $', ''));
      const taxAmount = parseFloat(tax.replace('Tax: $', ''));
      const totalAmount = parseFloat(total.replace('Total: $', ''));
      
      expect(totalAmount).to.equal(itemPrice + taxAmount);
    });
  });

  describe('Checkout Complete', function() {
    beforeEach(async function() {
      const checkoutInfo = users.checkoutInfo.valid;
      await cartPage.proceedToCheckout();
      await checkoutPage.shouldBeOnCheckoutStepOne();
      await checkoutPage.fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldBeOnCheckoutStepTwo();
      await checkoutPage.clickFinish();
      await checkoutPage.shouldBeOnCheckoutComplete();
    });

    it('should return to products page after order completion', async function() {
      await checkoutPage.clickBackHome();
      await productsPage.shouldBeOnProductsPage();
    });

    it('should reset cart after order completion', async function() {
      await checkoutPage.clickBackHome();
      await productsPage.shouldBeOnProductsPage();
      await productsPage.shouldShowCartBadge(0);
    });
  });

  describe('Mobile Checkout Tests', function() {
    beforeEach(async function() {
      if (driver) {
        await driver.quit();
      }
      driver = await WebDriverManager.createMobileDriver();
      loginPage = new LoginPage(driver);
      productsPage = new ProductsPage(driver);
      cartPage = new CartPage(driver);
      checkoutPage = new CheckoutPage(driver);
      
      await loginPage.visit();
      const user = users.validUsers.standard_user;
      await loginPage.login(user.username, user.password);
      await productsPage.shouldBeOnProductsPage();
      
      const product = products.products[0];
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
      await cartPage.shouldBeOnCartPage();
    });

    it('should complete checkout process on mobile @mobile', async function() {
      const checkoutInfo = users.checkoutInfo.valid;
      
      await cartPage.proceedToCheckout();
      
      await checkoutPage.shouldBeOnCheckoutStepOne();
      await checkoutPage.fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldBeOnCheckoutStepTwo();
      await checkoutPage.clickFinish();
      await checkoutPage.shouldBeOnCheckoutComplete();
      await checkoutPage.shouldShowOrderComplete();
    });

    it('should show validation errors on mobile @mobile @negative', async function() {
      const invalidInfo = users.checkoutInfo.invalid.missingFirstName;
      
      await cartPage.proceedToCheckout();
      
      await checkoutPage.shouldBeOnCheckoutStepOne();
      await checkoutPage.fillCheckoutInformation(invalidInfo.firstName, invalidInfo.lastName, invalidInfo.postalCode);
      await checkoutPage.clickContinue();
      await checkoutPage.shouldShowErrorMessage(invalidInfo.expectedError);
    });
  });

  describe('End-to-End Checkout Flow', function() {
    it('should complete full shopping and checkout flow @e2e', async function() {
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

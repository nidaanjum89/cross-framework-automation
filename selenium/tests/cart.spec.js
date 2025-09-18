const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const WebDriverManager = require('../config/webdriver');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const users = require('../fixtures/users.json');
const products = require('../fixtures/products.json');

describe('Cart Functionality', function() {
  let driver;
  let loginPage;
  let productsPage;
  let cartPage;

  beforeEach(async function() {
    driver = await WebDriverManager.createDriver();
    loginPage = new LoginPage(driver);
    productsPage = new ProductsPage(driver);
    cartPage = new CartPage(driver);
    
    // Login and navigate to products page
    await loginPage.visit();
    const user = users.validUsers.standard_user;
    await loginPage.login(user.username, user.password);
    await productsPage.shouldBeOnProductsPage();
  });

  afterEach(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  describe('Cart Management', function() {
    it('should display empty cart initially @smoke', async function() {
      await productsPage.openCart();
      await cartPage.shouldBeOnCartPage();
      await cartPage.shouldHaveItemCount(0);
    });

    it('should display added items in cart @smoke', async function() {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
      
      await cartPage.shouldBeOnCartPage();
      await cartPage.shouldHaveItemCount(1);
      await cartPage.shouldContainItem(product.displayName);
    });

    it('should display multiple items in cart', async function() {
      const product1 = products.products[0];
      const product2 = products.products[1];
      
      await productsPage.addProductToCart(product1.name);
      await productsPage.addProductToCart(product2.name);
      await productsPage.openCart();
      
      await cartPage.shouldBeOnCartPage();
      await cartPage.shouldHaveItemCount(2);
      await cartPage.shouldContainItem(product1.displayName);
      await cartPage.shouldContainItem(product2.displayName);
    });

    it('should remove item from cart', async function() {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
      
      await cartPage.shouldBeOnCartPage();
      await cartPage.shouldHaveItemCount(1);
      await cartPage.removeItem(product.name);
      await cartPage.shouldHaveItemCount(0);
      await cartPage.shouldNotContainItem(product.displayName);
    });

    it('should continue shopping from cart', async function() {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
      
      await cartPage.shouldBeOnCartPage();
      await cartPage.continueShopping();
      await productsPage.shouldBeOnProductsPage();
    });
  });

  describe('Cart Item Details', function() {
    beforeEach(async function() {
      const product = products.products[0];
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
    });

    it('should display correct item price', async function() {
      const product = products.products[0];
      
      const price = await cartPage.getItemPrice(product.displayName);
      expect(price).to.include(product.price);
    });

    it('should display correct item quantity', async function() {
      const product = products.products[0];
      
      const quantity = await cartPage.getItemQuantity(product.displayName);
      expect(quantity).to.equal('1');
    });
  });

  describe('Mobile Cart Tests', function() {
    beforeEach(async function() {
      if (driver) {
        await driver.quit();
      }
      driver = await WebDriverManager.createMobileDriver();
      loginPage = new LoginPage(driver);
      productsPage = new ProductsPage(driver);
      cartPage = new CartPage(driver);
      
      await loginPage.visit();
      const user = users.validUsers.standard_user;
      await loginPage.login(user.username, user.password);
      await productsPage.shouldBeOnProductsPage();
    });

    it('should display cart correctly on mobile @mobile', async function() {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
      
      await cartPage.shouldBeOnCartPage();
      await cartPage.shouldHaveItemCount(1);
      await cartPage.shouldContainItem(product.displayName);
    });

    it('should remove items from cart on mobile @mobile', async function() {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
      
      await cartPage.shouldBeOnCartPage();
      await cartPage.removeItem(product.name);
      await cartPage.shouldHaveItemCount(0);
    });
  });
});

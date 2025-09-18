const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const WebDriverManager = require('../config/webdriver');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const users = require('../fixtures/users.json');
const products = require('../fixtures/products.json');

describe('Products Functionality', function() {
  let driver;
  let loginPage;
  let productsPage;
  let cartPage;

  beforeEach(async function() {
    driver = await WebDriverManager.createDriver();
    loginPage = new LoginPage(driver);
    productsPage = new ProductsPage(driver);
    cartPage = new CartPage(driver);
    
    // Login before each test
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

  describe('Product Display and Navigation', function() {
    it('should display all products correctly @smoke', async function() {
      await productsPage.shouldHaveProductCount(6);
      await productsPage.shouldHaveProduct('Sauce Labs Backpack');
      await productsPage.shouldHaveProduct('Sauce Labs Bike Light');
    });

    it('should sort products by name A to Z', async function() {
      await productsPage.sortProducts('az');
      
      const names = await productsPage.getProductNames();
      const sortedNames = [...names].sort();
      expect(names).to.deep.equal(sortedNames);
    });

    it('should sort products by name Z to A', async function() {
      await productsPage.sortProducts('za');
      
      const names = await productsPage.getProductNames();
      const sortedNames = [...names].sort().reverse();
      expect(names).to.deep.equal(sortedNames);
    });

    it('should sort products by price low to high', async function() {
      await productsPage.sortProducts('lohi');
      
      const prices = await productsPage.getProductPrices();
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sortedPrices);
    });

    it('should navigate to product detail page', async function() {
      const product = products.products[0];
      await productsPage.clickProduct(product.displayName);
      
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('/inventory-item.html');
    });
  });

  describe('Add to Cart Functionality', function() {
    it('should add single product to cart @smoke', async function() {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.shouldShowCartBadge(1);
    });

    it('should add multiple products to cart', async function() {
      const product1 = products.products[0];
      const product2 = products.products[1];
      
      await productsPage.addProductToCart(product1.name);
      await productsPage.addProductToCart(product2.name);
      await productsPage.shouldShowCartBadge(2);
    });

    it('should remove product from cart', async function() {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.shouldShowCartBadge(1);
      await productsPage.removeProductFromCart(product.name);
      await productsPage.shouldShowCartBadge(0);
    });

    it('should navigate to cart page', async function() {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
      await cartPage.shouldBeOnCartPage();
    });
  });

  describe('Mobile Product Tests', function() {
    beforeEach(async function() {
      if (driver) {
        await driver.quit();
      }
      driver = await WebDriverManager.createMobileDriver();
      loginPage = new LoginPage(driver);
      productsPage = new ProductsPage(driver);
      
      await loginPage.visit();
      const user = users.validUsers.standard_user;
      await loginPage.login(user.username, user.password);
      await productsPage.shouldBeOnProductsPage();
    });

    it('should display products correctly on mobile @mobile', async function() {
      await productsPage.shouldHaveProductCount(6);
    });

    it('should add product to cart on mobile @mobile', async function() {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.shouldShowCartBadge(1);
    });

    it('should sort products on mobile @mobile', async function() {
      await productsPage.sortProducts('za');
      
      const names = await productsPage.getProductNames();
      const sortedNames = [...names].sort().reverse();
      expect(names).to.deep.equal(sortedNames);
    });
  });
});

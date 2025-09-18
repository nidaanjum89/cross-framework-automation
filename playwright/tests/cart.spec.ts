import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import users from '../fixtures/users.json';
import products from '../fixtures/products.json';

test.describe('Cart Functionality', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    
    // Login and navigate to products page
    await loginPage.visit();
    const user = users.validUsers.standard_user;
    await loginPage.login(user.username, user.password);
    await productsPage.shouldBeOnProductsPage();
  });

  test.describe('Cart Management', () => {
    test('should display empty cart initially', { tag: '@smoke' }, async () => {
      await productsPage.openCart();
      await cartPage.shouldBeOnCartPage();
      await cartPage.shouldHaveItemCount(0);
    });

    test('should display added items in cart', { tag: '@smoke' }, async () => {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
      
      await cartPage.shouldBeOnCartPage();
      await cartPage.shouldHaveItemCount(1);
      await cartPage.shouldContainItem(product.displayName);
    });

    test('should display multiple items in cart', async () => {
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

    test('should remove item from cart', async () => {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
      
      await cartPage.shouldBeOnCartPage();
      await cartPage.shouldHaveItemCount(1);
      await cartPage.removeItem(product.name);
      await cartPage.shouldHaveItemCount(0);
      await cartPage.shouldNotContainItem(product.displayName);
    });

    test('should continue shopping from cart', async () => {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
      
      await cartPage.shouldBeOnCartPage();
      await cartPage.continueShopping();
      await productsPage.shouldBeOnProductsPage();
    });
  });

  test.describe('Cart Item Details', () => {
    test.beforeEach(async () => {
      const product = products.products[0];
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
    });

    test('should display correct item price', async () => {
      const product = products.products[0];
      
      const priceLocator = cartPage.getItemPrice(product.displayName);
      await expect(priceLocator).toContainText(product.price);
    });

    test('should display correct item quantity', async () => {
      const product = products.products[0];
      
      const quantityLocator = cartPage.getItemQuantity(product.displayName);
      await expect(quantityLocator).toContainText('1');
    });
  });

  test.describe('Mobile Cart Tests', () => {
    test('should display cart correctly on mobile', { tag: '@mobile' }, async ({ browser }) => {
      const context = await browser.newContext({
        ...test.info().project.use,
        viewport: { width: 375, height: 667 }
      });
      const page = await context.newPage();
      const mobileLoginPage = new LoginPage(page);
      const mobileProductsPage = new ProductsPage(page);
      const mobileCartPage = new CartPage(page);
      
      const user = users.validUsers.standard_user;
      const product = products.products[0];
      
      await mobileLoginPage.visit();
      await mobileLoginPage.login(user.username, user.password);
      await mobileProductsPage.addProductToCart(product.name);
      await mobileProductsPage.openCart();
      
      await mobileCartPage.shouldBeOnCartPage();
      await mobileCartPage.shouldHaveItemCount(1);
      await mobileCartPage.shouldContainItem(product.displayName);
      
      await context.close();
    });

    test('should remove items from cart on mobile', { tag: '@mobile' }, async ({ browser }) => {
      const context = await browser.newContext({
        ...test.info().project.use,
        viewport: { width: 375, height: 667 }
      });
      const page = await context.newPage();
      const mobileLoginPage = new LoginPage(page);
      const mobileProductsPage = new ProductsPage(page);
      const mobileCartPage = new CartPage(page);
      
      const user = users.validUsers.standard_user;
      const product = products.products[0];
      
      await mobileLoginPage.visit();
      await mobileLoginPage.login(user.username, user.password);
      await mobileProductsPage.addProductToCart(product.name);
      await mobileProductsPage.openCart();
      
      await mobileCartPage.shouldBeOnCartPage();
      await mobileCartPage.removeItem(product.name);
      await mobileCartPage.shouldHaveItemCount(0);
      
      await context.close();
    });
  });
});

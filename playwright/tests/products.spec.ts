import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import users from '../fixtures/users.json';
import products from '../fixtures/products.json';

test.describe('Products Functionality', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    
    // Login before each test
    await loginPage.visit();
    const user = users.validUsers.standard_user;
    await loginPage.login(user.username, user.password);
    await productsPage.shouldBeOnProductsPage();
  });

  test.describe('Product Display and Navigation', () => {
    test('should display all products correctly', { tag: '@smoke' }, async () => {
      await productsPage.shouldHaveProductCount(6);
      await productsPage.shouldHaveProduct('Sauce Labs Backpack');
      await productsPage.shouldHaveProduct('Sauce Labs Bike Light');
    });

    test('should sort products by name A to Z', async () => {
      await productsPage.sortProducts('az');
      
      const names = await productsPage.getProductNames();
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    test('should sort products by name Z to A', async () => {
      await productsPage.sortProducts('za');
      
      const names = await productsPage.getProductNames();
      const sortedNames = [...names].sort().reverse();
      expect(names).toEqual(sortedNames);
    });

    test('should sort products by price low to high', async () => {
      await productsPage.sortProducts('lohi');
      
      const prices = await productsPage.getProductPrices();
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sortedPrices);
    });

    test('should navigate to product detail page', async ({ page }) => {
      const product = products.products[0];
      await productsPage.clickProduct(product.displayName);
      
      await expect(page).toHaveURL(/\/inventory-item\.html/);
      await expect(page.locator('.inventory_details_name')).toContainText(product.displayName);
    });
  });

  test.describe('Add to Cart Functionality', () => {
    test('should add single product to cart', { tag: '@smoke' }, async () => {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.shouldShowCartBadge(1);
    });

    test('should add multiple products to cart', async () => {
      const product1 = products.products[0];
      const product2 = products.products[1];
      
      await productsPage.addProductToCart(product1.name);
      await productsPage.addProductToCart(product2.name);
      await productsPage.shouldShowCartBadge(2);
    });

    test('should remove product from cart', async () => {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.shouldShowCartBadge(1);
      await productsPage.removeProductFromCart(product.name);
      await productsPage.shouldShowCartBadge(0);
    });

    test('should navigate to cart page', async () => {
      const product = products.products[0];
      
      await productsPage.addProductToCart(product.name);
      await productsPage.openCart();
      await cartPage.shouldBeOnCartPage();
    });
  });

  test.describe('Mobile Product Tests', () => {
    test('should display products correctly on mobile', { tag: '@mobile' }, async ({ browser }) => {
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
      await mobileProductsPage.shouldHaveProductCount(6);
      
      await context.close();
    });

    test('should add product to cart on mobile', { tag: '@mobile' }, async ({ browser }) => {
      const context = await browser.newContext({
        ...test.info().project.use,
        viewport: { width: 375, height: 667 }
      });
      const page = await context.newPage();
      const mobileLoginPage = new LoginPage(page);
      const mobileProductsPage = new ProductsPage(page);
      
      const user = users.validUsers.standard_user;
      const product = products.products[0];
      
      await mobileLoginPage.visit();
      await mobileLoginPage.login(user.username, user.password);
      await mobileProductsPage.addProductToCart(product.name);
      await mobileProductsPage.shouldShowCartBadge(1);
      
      await context.close();
    });

    test('should sort products on mobile', { tag: '@mobile' }, async ({ browser }) => {
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
      await mobileProductsPage.sortProducts('za');
      
      const names = await mobileProductsPage.getProductNames();
      const sortedNames = [...names].sort().reverse();
      expect(names).toEqual(sortedNames);
      
      await context.close();
    });
  });
});

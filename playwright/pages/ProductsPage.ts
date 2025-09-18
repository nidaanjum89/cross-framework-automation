import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;
  readonly addToCartButtons: Locator;
  readonly removeButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('.product_sort_container');
    this.inventoryItems = page.locator('.inventory_item');
    this.inventoryItemNames = page.locator('.inventory_item_name');
    this.inventoryItemPrices = page.locator('.inventory_item_price');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.removeButtons = page.locator('[data-test^="remove"]');
  }

  async shouldBeOnProductsPage() {
    await expect(this.page).toHaveURL(/\/inventory\.html/);
    await expect(this.pageTitle).toContainText('Products');
    return this;
  }

  async addProductToCart(productName: string) {
    await this.page.locator(`[data-test="add-to-cart-${productName}"]`).click();
    return this;
  }

  async removeProductFromCart(productName: string) {
    await this.page.locator(`[data-test="remove-${productName}"]`).click();
    return this;
  }

  async clickProduct(productName: string) {
    await this.inventoryItemNames.filter({ hasText: productName }).click();
    return this;
  }

  async sortProducts(sortOption: string) {
    await this.sortDropdown.selectOption(sortOption);
    return this;
  }

  async openCart() {
    await this.cartIcon.click();
    return this;
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
    return this;
  }

  async shouldHaveProductCount(count: number) {
    await expect(this.inventoryItems).toHaveCount(count);
    return this;
  }

  async shouldShowCartBadge(count: number) {
    if (count > 0) {
      await expect(this.cartBadge).toBeVisible();
      await expect(this.cartBadge).toContainText(count.toString());
    } else {
      await expect(this.cartBadge).not.toBeVisible();
    }
    return this;
  }

  async shouldHaveProduct(productName: string) {
    await expect(this.inventoryItemNames.filter({ hasText: productName })).toBeVisible();
    return this;
  }

  getProductPrice(productName: string) {
    return this.inventoryItems
      .filter({ has: this.page.locator('.inventory_item_name', { hasText: productName }) })
      .locator('.inventory_item_price');
  }

  async getProductNames(): Promise<string[]> {
    return await this.inventoryItemNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItemPrices.allTextContents();
    return priceTexts.map(price => parseFloat(price.replace('$', '')));
  }
}

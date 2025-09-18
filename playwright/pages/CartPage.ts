import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartQuantities: Locator;
  readonly removeButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.cartQuantities = page.locator('.cart_quantity');
    this.removeButtons = page.locator('[data-test^="remove"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async shouldBeOnCartPage() {
    await expect(this.page).toHaveURL(/\/cart\.html/);
    await expect(this.pageTitle).toContainText('Your Cart');
    return this;
  }

  async removeItem(productName: string) {
    await this.page.locator(`[data-test="remove-${productName}"]`).click();
    return this;
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
    return this;
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    return this;
  }

  async shouldHaveItemCount(count: number) {
    if (count > 0) {
      await expect(this.cartItems).toHaveCount(count);
    } else {
      await expect(this.cartItems).toHaveCount(0);
    }
    return this;
  }

  async shouldContainItem(productName: string) {
    await expect(this.cartItemNames.filter({ hasText: productName })).toBeVisible();
    return this;
  }

  async shouldNotContainItem(productName: string) {
    // If there are no cart items, the product is definitely not there
    const itemCount = await this.cartItems.count();
    if (itemCount === 0) {
      return this;
    }
    // If there are items, check that none contain the product name
    await expect(this.cartItemNames.filter({ hasText: productName })).not.toBeVisible();
    return this;
  }

  getItemPrice(productName: string) {
    return this.cartItems
      .filter({ has: this.page.locator('.inventory_item_name', { hasText: productName }) })
      .locator('.inventory_item_price');
  }

  getItemQuantity(productName: string) {
    return this.cartItems
      .filter({ has: this.page.locator('.inventory_item_name', { hasText: productName }) })
      .locator('.cart_quantity');
  }
}

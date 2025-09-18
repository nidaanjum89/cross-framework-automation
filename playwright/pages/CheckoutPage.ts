import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  
  // Step One selectors
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step Two selectors
  readonly cartItems: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;

  // Complete selectors
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    
    // Step One
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step Two
    this.cartItems = page.locator('.cart_item');
    this.paymentInfo = page.locator('.summary_info_label').filter({ hasText: 'Payment Information' });
    this.shippingInfo = page.locator('.summary_info_label').filter({ hasText: 'Shipping Information' });
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');

    // Complete
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  // Step One actions
  async shouldBeOnCheckoutStepOne() {
    await expect(this.page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(this.pageTitle).toContainText('Checkout: Your Information');
    return this;
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.clear();
    await this.postalCodeInput.fill(postalCode);
    return this;
  }

  async clickContinue() {
    await this.continueButton.click();
    return this;
  }

  async clickCancel() {
    await this.cancelButton.click();
    return this;
  }

  // Step Two actions
  async shouldBeOnCheckoutStepTwo() {
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html/);
    await expect(this.pageTitle).toContainText('Checkout: Overview');
    return this;
  }

  async clickFinish() {
    await this.finishButton.click();
    return this;
  }

  // Complete actions
  async shouldBeOnCheckoutComplete() {
    await expect(this.page).toHaveURL(/\/checkout-complete\.html/);
    await expect(this.pageTitle).toContainText('Checkout: Complete!');
    return this;
  }

  async clickBackHome() {
    await this.backHomeButton.click();
    return this;
  }

  // Assertions
  async shouldShowErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
    return this;
  }

  async shouldShowOrderComplete() {
    await expect(this.completeHeader).toContainText('Thank you for your order!');
    await expect(this.completeText).toContainText('Your order has been dispatched');
    return this;
  }

  async getTotalAmount(): Promise<string> {
    return await this.total.textContent() || '';
  }

  async getItemTotalAmount(): Promise<string> {
    return await this.itemTotal.textContent() || '';
  }

  async getTaxAmount(): Promise<string> {
    return await this.tax.textContent() || '';
  }
}

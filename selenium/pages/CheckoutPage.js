const { By, until } = require('selenium-webdriver');

class CheckoutPage {
  constructor(driver) {
    this.driver = driver;
    
    // Step One locators
    this.pageTitle = By.css('.title');
    this.firstNameInput = By.css('[data-test="firstName"]');
    this.lastNameInput = By.css('[data-test="lastName"]');
    this.postalCodeInput = By.css('[data-test="postalCode"]');
    this.continueButton = By.css('[data-test="continue"]');
    this.cancelButton = By.css('[data-test="cancel"]');
    this.errorMessage = By.css('[data-test="error"]');

    // Step Two locators
    this.cartItems = By.css('.cart_item');
    this.paymentInfo = By.css('.summary_info_label');
    this.shippingInfo = By.css('.summary_info_label');
    this.itemTotal = By.css('.summary_subtotal_label');
    this.tax = By.css('.summary_tax_label');
    this.total = By.css('.summary_total_label');
    this.finishButton = By.css('[data-test="finish"]');

    // Complete locators
    this.completeHeader = By.css('.complete-header');
    this.completeText = By.css('.complete-text');
    this.backHomeButton = By.css('[data-test="back-to-products"]');
  }

  // Step One methods
  async shouldBeOnCheckoutStepOne() {
    await this.driver.wait(until.urlContains('/checkout-step-one.html'), 5000);
    const title = await this.driver.findElement(this.pageTitle);
    await this.driver.wait(until.elementTextContains(title, 'Checkout: Your Information'), 5000);
    return this;
  }

  async fillCheckoutInformation(firstName, lastName, postalCode) {
    const firstNameField = await this.driver.findElement(this.firstNameInput);
    await firstNameField.clear();
    await firstNameField.sendKeys(firstName);

    const lastNameField = await this.driver.findElement(this.lastNameInput);
    await lastNameField.clear();
    await lastNameField.sendKeys(lastName);

    const postalCodeField = await this.driver.findElement(this.postalCodeInput);
    await postalCodeField.clear();
    await postalCodeField.sendKeys(postalCode);

    return this;
  }

  async clickContinue() {
    await this.driver.findElement(this.continueButton).click();
    return this;
  }

  async clickCancel() {
    await this.driver.findElement(this.cancelButton).click();
    return this;
  }

  // Step Two methods
  async shouldBeOnCheckoutStepTwo() {
    await this.driver.wait(until.urlContains('/checkout-step-two.html'), 5000);
    const title = await this.driver.findElement(this.pageTitle);
    await this.driver.wait(until.elementTextContains(title, 'Checkout: Overview'), 5000);
    return this;
  }

  async clickFinish() {
    await this.driver.findElement(this.finishButton).click();
    return this;
  }

  // Complete methods
  async shouldBeOnCheckoutComplete() {
    await this.driver.wait(until.urlContains('/checkout-complete.html'), 5000);
    const title = await this.driver.findElement(this.pageTitle);
    await this.driver.wait(until.elementTextContains(title, 'Checkout: Complete!'), 5000);
    return this;
  }

  async clickBackHome() {
    await this.driver.findElement(this.backHomeButton).click();
    return this;
  }

  // Assertion methods
  async shouldShowErrorMessage(expectedMessage) {
    const errorElement = await this.driver.findElement(this.errorMessage);
    await this.driver.wait(until.elementIsVisible(errorElement), 5000);
    const actualMessage = await errorElement.getText();
    if (!actualMessage.includes(expectedMessage)) {
      throw new Error(`Expected error message to contain "${expectedMessage}", but got "${actualMessage}"`);
    }
    return this;
  }

  async shouldShowOrderComplete() {
    const header = await this.driver.findElement(this.completeHeader);
    const headerText = await header.getText();
    if (!headerText.includes('Thank you for your order!')) {
      throw new Error(`Expected completion header to contain "Thank you for your order!", but got "${headerText}"`);
    }

    const text = await this.driver.findElement(this.completeText);
    const completeText = await text.getText();
    if (!completeText.includes('Your order has been dispatched')) {
      throw new Error(`Expected completion text to contain "Your order has been dispatched", but got "${completeText}"`);
    }
    return this;
  }

  async getTotalAmount() {
    const totalElement = await this.driver.findElement(this.total);
    return await totalElement.getText();
  }

  async getItemTotalAmount() {
    const itemTotalElement = await this.driver.findElement(this.itemTotal);
    return await itemTotalElement.getText();
  }

  async getTaxAmount() {
    const taxElement = await this.driver.findElement(this.tax);
    return await taxElement.getText();
  }
}

module.exports = CheckoutPage;

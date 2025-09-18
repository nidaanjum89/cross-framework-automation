const { By, until } = require('selenium-webdriver');

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.baseUrl = 'https://www.saucedemo.com';
    
    // Locators
    this.usernameInput = By.css('[data-test="username"]');
    this.passwordInput = By.css('[data-test="password"]');
    this.loginButton = By.css('[data-test="login-button"]');
    this.errorMessage = By.css('[data-test="error"]');
    this.pageTitle = By.css('.login_logo');
  }

  async visit() {
    await this.driver.get(this.baseUrl);
    return this;
  }

  async login(username, password) {
    await this.driver.findElement(this.usernameInput).sendKeys(username);
    await this.driver.findElement(this.passwordInput).sendKeys(password);
    await this.driver.findElement(this.loginButton).click();
    return this;
  }

  async shouldBeOnLoginPage() {
    await this.driver.wait(until.urlContains('/'), 5000);
    const title = await this.driver.findElement(this.pageTitle);
    await this.driver.wait(until.elementIsVisible(title), 5000);
    return this;
  }

  async shouldShowErrorMessage(expectedMessage) {
    const errorElement = await this.driver.findElement(this.errorMessage);
    await this.driver.wait(until.elementIsVisible(errorElement), 5000);
    const actualMessage = await errorElement.getText();
    if (!actualMessage.includes(expectedMessage)) {
      throw new Error(`Expected error message to contain "${expectedMessage}", but got "${actualMessage}"`);
    }
    return this;
  }

  async clearForm() {
    await this.driver.findElement(this.usernameInput).clear();
    await this.driver.findElement(this.passwordInput).clear();
    return this;
  }
}

module.exports = LoginPage;

import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorButton = page.locator('.error-button');
  }

  async visit() {
    await this.page.goto('/');
    return this;
  }

  async enterUsername(username: string) {
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
    return this;
  }

  async enterPassword(password: string) {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
    return this;
  }

  async clickLogin() {
    await this.loginButton.click();
    return this;
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
    return this;
  }

  async shouldShowErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
    return this;
  }

  async shouldBeOnLoginPage() {
    await expect(this.page).toHaveURL(/saucedemo\.com/);
    await expect(this.loginButton).toBeVisible();
    return this;
  }

  async clearError() {
    await this.errorButton.click();
    return this;
  }
}

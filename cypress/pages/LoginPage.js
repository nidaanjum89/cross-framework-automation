class LoginPage {
  // Selectors
  get usernameInput() { return cy.get('[data-test="username"]') }
  get passwordInput() { return cy.get('[data-test="password"]') }
  get loginButton() { return cy.get('[data-test="login-button"]') }
  get errorMessage() { return cy.get('[data-test="error"]') }
  get errorButton() { return cy.get('.error-button') }

  // Actions
  visit() {
    cy.visit('/')
    return this
  }

  enterUsername(username) {
    this.usernameInput.clear().type(username)
    return this
  }

  enterPassword(password) {
    this.passwordInput.clear().type(password)
    return this
  }

  clickLogin() {
    this.loginButton.click()
    return this
  }

  login(username, password) {
    this.enterUsername(username)
    this.enterPassword(password)
    this.clickLogin()
    return this
  }

  // Assertions
  shouldShowErrorMessage(message) {
    this.errorMessage.should('be.visible').and('contain.text', message)
    return this
  }

  shouldBeOnLoginPage() {
    cy.url().should('include', 'saucedemo.com')
    this.loginButton.should('be.visible')
    return this
  }

  clearError() {
    this.errorButton.click()
    return this
  }
}

export default LoginPage

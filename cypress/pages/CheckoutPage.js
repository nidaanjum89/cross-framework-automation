class CheckoutPage {
  // Selectors - Step One
  get pageTitle() { return cy.get('.title') }
  get firstNameInput() { return cy.get('[data-test="firstName"]') }
  get lastNameInput() { return cy.get('[data-test="lastName"]') }
  get postalCodeInput() { return cy.get('[data-test="postalCode"]') }
  get continueButton() { return cy.get('[data-test="continue"]') }
  get cancelButton() { return cy.get('[data-test="cancel"]') }
  get errorMessage() { return cy.get('[data-test="error"]') }

  // Selectors - Step Two (Overview)
  get cartItems() { return cy.get('.cart_item') }
  get paymentInfo() { return cy.get('.summary_info_label').contains('Payment Information') }
  get shippingInfo() { return cy.get('.summary_info_label').contains('Shipping Information') }
  get itemTotal() { return cy.get('.summary_subtotal_label') }
  get tax() { return cy.get('.summary_tax_label') }
  get total() { return cy.get('.summary_total_label') }
  get finishButton() { return cy.get('[data-test="finish"]') }

  // Selectors - Complete
  get completeHeader() { return cy.get('.complete-header') }
  get completeText() { return cy.get('.complete-text') }
  get backHomeButton() { return cy.get('[data-test="back-to-products"]') }

  // Actions - Step One
  shouldBeOnCheckoutStepOne() {
    cy.url().should('include', '/checkout-step-one.html')
    this.pageTitle.should('contain.text', 'Checkout: Your Information')
    return this
  }

  fillCheckoutInformation(firstName, lastName, postalCode) {
    this.firstNameInput.clear().type(firstName)
    this.lastNameInput.clear().type(lastName)
    this.postalCodeInput.clear().type(postalCode)
    return this
  }

  clickContinue() {
    this.continueButton.click()
    return this
  }

  clickCancel() {
    this.cancelButton.click()
    return this
  }

  // Actions - Step Two
  shouldBeOnCheckoutStepTwo() {
    cy.url().should('include', '/checkout-step-two.html')
    this.pageTitle.should('contain.text', 'Checkout: Overview')
    return this
  }

  clickFinish() {
    this.finishButton.click()
    return this
  }

  // Actions - Complete
  shouldBeOnCheckoutComplete() {
    cy.url().should('include', '/checkout-complete.html')
    this.pageTitle.should('contain.text', 'Checkout: Complete!')
    return this
  }

  clickBackHome() {
    this.backHomeButton.click()
    return this
  }

  // Assertions
  shouldShowErrorMessage(message) {
    this.errorMessage.should('be.visible').and('contain.text', message)
    return this
  }

  shouldShowOrderComplete() {
    this.completeHeader.should('contain.text', 'Thank you for your order!')
    this.completeText.should('contain.text', 'Your order has been dispatched')
    return this
  }

  getTotalAmount() {
    return this.total.invoke('text')
  }

  getItemTotalAmount() {
    return this.itemTotal.invoke('text')
  }

  getTaxAmount() {
    return this.tax.invoke('text')
  }
}

export default CheckoutPage

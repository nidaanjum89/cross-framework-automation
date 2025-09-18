class CartPage {
  // Selectors
  get pageTitle() { return cy.get('.title') }
  get cartItems() { return cy.get('.cart_item') }
  get cartItemNames() { return cy.get('.inventory_item_name') }
  get cartItemPrices() { return cy.get('.inventory_item_price') }
  get cartQuantities() { return cy.get('.cart_quantity') }
  get removeButtons() { return cy.get('[data-test^="remove"]') }
  get continueShoppingButton() { return cy.get('[data-test="continue-shopping"]') }
  get checkoutButton() { return cy.get('[data-test="checkout"]') }

  // Actions
  shouldBeOnCartPage() {
    cy.url().should('include', '/cart.html')
    this.pageTitle.should('contain.text', 'Your Cart')
    return this
  }

  removeItem(productName) {
    cy.get(`[data-test="remove-${productName}"]`).click()
    return this
  }

  continueShopping() {
    this.continueShoppingButton.click()
    return this
  }

  proceedToCheckout() {
    this.checkoutButton.click()
    return this
  }

  // Assertions
  shouldHaveItemCount(count) {
    if (count > 0) {
      this.cartItems.should('have.length', count)
    } else {
      this.cartItems.should('not.exist')
    }
    return this
  }

  shouldContainItem(productName) {
    this.cartItemNames.should('contain.text', productName)
    return this
  }

  shouldNotContainItem(productName) {
    this.cartItemNames.should('not.contain.text', productName)
    return this
  }

  getItemPrice(productName) {
    return cy.get('.cart_item')
      .contains('.inventory_item_name', productName)
      .parent()
      .find('.inventory_item_price')
  }

  getItemQuantity(productName) {
    return cy.get('.cart_item')
      .contains('.inventory_item_name', productName)
      .parent()
      .find('.cart_quantity')
  }
}

export default CartPage

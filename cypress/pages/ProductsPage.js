class ProductsPage {
  // Selectors
  get pageTitle() { return cy.get('.title') }
  get menuButton() { return cy.get('#react-burger-menu-btn') }
  get logoutLink() { return cy.get('#logout_sidebar_link') }
  get cartIcon() { return cy.get('.shopping_cart_link') }
  get cartBadge() { return cy.get('.shopping_cart_badge') }
  get sortDropdown() { return cy.get('.product_sort_container') }
  get inventoryItems() { return cy.get('.inventory_item') }
  get inventoryItemNames() { return cy.get('.inventory_item_name') }
  get inventoryItemPrices() { return cy.get('.inventory_item_price') }
  get addToCartButtons() { return cy.get('[data-test^="add-to-cart"]') }
  get removeButtons() { return cy.get('[data-test^="remove"]') }

  // Actions
  shouldBeOnProductsPage() {
    cy.url().should('include', '/inventory.html')
    this.pageTitle.should('contain.text', 'Products')
    return this
  }

  addProductToCart(productName) {
    cy.get(`[data-test="add-to-cart-${productName}"]`).click()
    return this
  }

  removeProductFromCart(productName) {
    cy.get(`[data-test="remove-${productName}"]`).click()
    return this
  }

  clickProduct(productName) {
    cy.get('.inventory_item_name').contains(productName).click()
    return this
  }

  sortProducts(sortOption) {
    this.sortDropdown.select(sortOption)
    return this
  }

  openCart() {
    this.cartIcon.click()
    return this
  }

  logout() {
    this.menuButton.click()
    this.logoutLink.click()
    return this
  }

  // Assertions
  shouldHaveProductCount(count) {
    this.inventoryItems.should('have.length', count)
    return this
  }

  shouldShowCartBadge(count) {
    if (count > 0) {
      this.cartBadge.should('be.visible').and('contain.text', count.toString())
    } else {
      this.cartBadge.should('not.exist')
    }
    return this
  }

  shouldHaveProduct(productName) {
    this.inventoryItemNames.should('contain.text', productName)
    return this
  }

  getProductPrice(productName) {
    return cy.get('.inventory_item')
      .contains('.inventory_item_name', productName)
      .parent()
      .find('.inventory_item_price')
  }
}

export default ProductsPage

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for login
Cypress.Commands.add('login', (username, password) => {
  cy.get('[data-test="username"]').type(username)
  cy.get('[data-test="password"]').type(password)
  cy.get('[data-test="login-button"]').click()
})

// Custom command for logout
Cypress.Commands.add('logout', () => {
  cy.get('#react-burger-menu-btn').click()
  cy.get('#logout_sidebar_link').click()
})

// Custom command for adding product to cart
Cypress.Commands.add('addProductToCart', (productName) => {
  cy.get(`[data-test="add-to-cart-${productName}"]`).click()
})

// Custom command for removing product from cart
Cypress.Commands.add('removeProductFromCart', (productName) => {
  cy.get(`[data-test="remove-${productName}"]`).click()
})

// Custom command for mobile viewport
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport(375, 667) // iPhone SE dimensions
})

// Custom command for tablet viewport
Cypress.Commands.add('setTabletViewport', () => {
  cy.viewport(768, 1024) // iPad dimensions
})

// Custom command for desktop viewport
Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720) // Desktop dimensions
})

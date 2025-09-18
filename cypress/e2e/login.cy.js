import LoginPage from '../pages/LoginPage'
import ProductsPage from '../pages/ProductsPage'

describe('Login Functionality', () => {
  let loginPage
  let productsPage
  let users

  beforeEach(() => {
    loginPage = new LoginPage()
    productsPage = new ProductsPage()
    cy.fixture('users').then((userData) => {
      users = userData
    })
    loginPage.visit()
  })

  describe('Valid Login Scenarios', () => {
    it('should login successfully with standard user', { tags: '@smoke' }, () => {
      const user = users.validUsers.standard_user
      
      loginPage
        .login(user.username, user.password)
      
      productsPage
        .shouldBeOnProductsPage()
        .shouldHaveProductCount(6)
    })

    it('should login successfully with performance glitch user', () => {
      const user = users.validUsers.performance_glitch_user
      
      loginPage
        .login(user.username, user.password)
      
      productsPage
        .shouldBeOnProductsPage()
    })

    it('should login successfully with problem user', () => {
      const user = users.validUsers.problem_user
      
      loginPage
        .login(user.username, user.password)
      
      productsPage
        .shouldBeOnProductsPage()
    })
  })

  describe('Invalid Login Scenarios', () => {
    it('should show error for locked out user', { tags: '@negative' }, () => {
      const user = users.invalidUsers.locked_out_user
      
      loginPage
        .login(user.username, user.password)
        .shouldShowErrorMessage(user.expectedError)
    })

    it('should show error for invalid credentials', { tags: '@negative' }, () => {
      const user = users.invalidUsers.invalid_credentials
      
      loginPage
        .login(user.username, user.password)
        .shouldShowErrorMessage(user.expectedError)
    })

    it('should show error for empty username', { tags: '@negative' }, () => {
      const user = users.invalidUsers.empty_username
      
      loginPage
        .login(user.username, user.password)
        .shouldShowErrorMessage(user.expectedError)
    })

    it('should show error for empty password', { tags: '@negative' }, () => {
      const user = users.invalidUsers.empty_password
      
      loginPage
        .login(user.username, user.password)
        .shouldShowErrorMessage(user.expectedError)
    })
  })

  describe('Mobile Login Tests', () => {
    beforeEach(() => {
      cy.setMobileViewport()
    })

    it('should login successfully on mobile viewport', { tags: '@mobile' }, () => {
      const user = users.validUsers.standard_user
      
      loginPage
        .login(user.username, user.password)
      
      productsPage
        .shouldBeOnProductsPage()
    })

    it('should show error message properly on mobile', { tags: '@mobile @negative' }, () => {
      const user = users.invalidUsers.locked_out_user
      
      loginPage
        .login(user.username, user.password)
        .shouldShowErrorMessage(user.expectedError)
    })
  })

  describe('Logout Functionality', () => {
    beforeEach(() => {
      const user = users.validUsers.standard_user
      loginPage.login(user.username, user.password)
      productsPage.shouldBeOnProductsPage()
    })

    it('should logout successfully', { tags: '@smoke' }, () => {
      productsPage.logout()
      loginPage.shouldBeOnLoginPage()
    })
  })
})

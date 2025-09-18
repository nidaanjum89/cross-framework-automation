import LoginPage from '../pages/LoginPage'
import ProductsPage from '../pages/ProductsPage'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'

describe('Checkout Functionality', () => {
  let loginPage
  let productsPage
  let cartPage
  let checkoutPage
  let users
  let products

  beforeEach(() => {
    loginPage = new LoginPage()
    productsPage = new ProductsPage()
    cartPage = new CartPage()
    checkoutPage = new CheckoutPage()
    
    cy.fixture('users').then((userData) => {
      users = userData
    })
    cy.fixture('products').then((productData) => {
      products = productData
    })

    // Login, add product, and navigate to cart
    loginPage.visit()
    const user = users.validUsers.standard_user
    loginPage.login(user.username, user.password)
    productsPage.shouldBeOnProductsPage()
    
    const product = products.products[0]
    productsPage
      .addProductToCart(product.name)
      .openCart()
    
    cartPage.shouldBeOnCartPage()
  })

  describe('Checkout Process - Step One', () => {
    beforeEach(() => {
      cartPage.proceedToCheckout()
      checkoutPage.shouldBeOnCheckoutStepOne()
    })

    it('should complete checkout with valid information', { tags: '@smoke' }, () => {
      const checkoutInfo = users.checkoutInfo.valid
      
      checkoutPage
        .fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode)
        .clickContinue()
        .shouldBeOnCheckoutStepTwo()
    })

    it('should show error for missing first name', { tags: '@negative' }, () => {
      const invalidInfo = users.checkoutInfo.invalid.missingFirstName
      
      checkoutPage
        .fillCheckoutInformation(invalidInfo.firstName, invalidInfo.lastName, invalidInfo.postalCode)
        .clickContinue()
        .shouldShowErrorMessage(invalidInfo.expectedError)
    })

    it('should show error for missing last name', { tags: '@negative' }, () => {
      const invalidInfo = users.checkoutInfo.invalid.missingLastName
      
      checkoutPage
        .fillCheckoutInformation(invalidInfo.firstName, invalidInfo.lastName, invalidInfo.postalCode)
        .clickContinue()
        .shouldShowErrorMessage(invalidInfo.expectedError)
    })

    it('should show error for missing postal code', { tags: '@negative' }, () => {
      const invalidInfo = users.checkoutInfo.invalid.missingPostalCode
      
      checkoutPage
        .fillCheckoutInformation(invalidInfo.firstName, invalidInfo.lastName, invalidInfo.postalCode)
        .clickContinue()
        .shouldShowErrorMessage(invalidInfo.expectedError)
    })

    it('should cancel checkout and return to cart', () => {
      checkoutPage.clickCancel()
      cartPage.shouldBeOnCartPage()
    })
  })

  describe('Checkout Process - Step Two (Overview)', () => {
    beforeEach(() => {
      const checkoutInfo = users.checkoutInfo.valid
      cartPage.proceedToCheckout()
      checkoutPage
        .shouldBeOnCheckoutStepOne()
        .fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode)
        .clickContinue()
        .shouldBeOnCheckoutStepTwo()
    })

    it('should display order summary correctly', () => {
      const product = products.products[0]
      
      // Verify product is displayed
      cy.get('.cart_item').should('have.length', 1)
      cy.get('.inventory_item_name').should('contain.text', product.displayName)
      
      // Verify pricing information is displayed
      checkoutPage.itemTotal.should('be.visible')
      checkoutPage.tax.should('be.visible')
      checkoutPage.total.should('be.visible')
    })

    it('should complete order successfully', { tags: '@smoke' }, () => {
      checkoutPage
        .clickFinish()
        .shouldBeOnCheckoutComplete()
        .shouldShowOrderComplete()
    })

    it('should calculate total correctly', () => {
      checkoutPage.getItemTotalAmount().then((itemTotal) => {
        checkoutPage.getTaxAmount().then((tax) => {
          checkoutPage.getTotalAmount().then((total) => {
            const itemPrice = parseFloat(itemTotal.replace('Item total: $', ''))
            const taxAmount = parseFloat(tax.replace('Tax: $', ''))
            const totalAmount = parseFloat(total.replace('Total: $', ''))
            
            expect(totalAmount).to.equal(itemPrice + taxAmount)
          })
        })
      })
    })
  })

  describe('Checkout Complete', () => {
    beforeEach(() => {
      const checkoutInfo = users.checkoutInfo.valid
      cartPage.proceedToCheckout()
      checkoutPage
        .shouldBeOnCheckoutStepOne()
        .fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode)
        .clickContinue()
        .shouldBeOnCheckoutStepTwo()
        .clickFinish()
        .shouldBeOnCheckoutComplete()
    })

    it('should return to products page after order completion', () => {
      checkoutPage.clickBackHome()
      productsPage.shouldBeOnProductsPage()
    })

    it('should reset cart after order completion', () => {
      checkoutPage.clickBackHome()
      productsPage
        .shouldBeOnProductsPage()
        .shouldShowCartBadge(0)
    })
  })

  describe('Mobile Checkout Tests', () => {
    beforeEach(() => {
      cy.setMobileViewport()
    })

    it('should complete checkout process on mobile', { tags: '@mobile' }, () => {
      const checkoutInfo = users.checkoutInfo.valid
      
      cartPage.proceedToCheckout()
      
      checkoutPage
        .shouldBeOnCheckoutStepOne()
        .fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode)
        .clickContinue()
        .shouldBeOnCheckoutStepTwo()
        .clickFinish()
        .shouldBeOnCheckoutComplete()
        .shouldShowOrderComplete()
    })

    it('should show validation errors on mobile', { tags: '@mobile @negative' }, () => {
      const invalidInfo = users.checkoutInfo.invalid.missingFirstName
      
      cartPage.proceedToCheckout()
      
      checkoutPage
        .shouldBeOnCheckoutStepOne()
        .fillCheckoutInformation(invalidInfo.firstName, invalidInfo.lastName, invalidInfo.postalCode)
        .clickContinue()
        .shouldShowErrorMessage(invalidInfo.expectedError)
    })
  })

  describe('End-to-End Checkout Flow', () => {
    it('should complete full shopping and checkout flow', { tags: '@e2e' }, () => {
      const checkoutInfo = users.checkoutInfo.valid
      const product1 = products.products[0]
      const product2 = products.products[1]
      
      // Go back to products and add another item
      cartPage.continueShopping()
      productsPage
        .addProductToCart(product2.name)
        .shouldShowCartBadge(2)
        .openCart()
      
      // Complete checkout
      cartPage
        .shouldHaveItemCount(2)
        .proceedToCheckout()
      
      checkoutPage
        .shouldBeOnCheckoutStepOne()
        .fillCheckoutInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode)
        .clickContinue()
        .shouldBeOnCheckoutStepTwo()
        .clickFinish()
        .shouldBeOnCheckoutComplete()
        .shouldShowOrderComplete()
        .clickBackHome()
      
      productsPage
        .shouldBeOnProductsPage()
        .shouldShowCartBadge(0)
    })
  })
})

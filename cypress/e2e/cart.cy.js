import LoginPage from '../pages/LoginPage'
import ProductsPage from '../pages/ProductsPage'
import CartPage from '../pages/CartPage'

describe('Cart Functionality', () => {
  let loginPage
  let productsPage
  let cartPage
  let users
  let products

  beforeEach(() => {
    loginPage = new LoginPage()
    productsPage = new ProductsPage()
    cartPage = new CartPage()
    
    cy.fixture('users').then((userData) => {
      users = userData
    })
    cy.fixture('products').then((productData) => {
      products = productData
    })

    // Login and navigate to products page
    loginPage.visit()
    const user = users.validUsers.standard_user
    loginPage.login(user.username, user.password)
    productsPage.shouldBeOnProductsPage()
  })

  describe('Cart Management', () => {
    it('should display empty cart initially', { tags: '@smoke' }, () => {
      productsPage.openCart()
      cartPage
        .shouldBeOnCartPage()
        .shouldHaveItemCount(0)
    })

    it('should display added items in cart', { tags: '@smoke' }, () => {
      const product = products.products[0]
      
      productsPage
        .addProductToCart(product.name)
        .openCart()
      
      cartPage
        .shouldBeOnCartPage()
        .shouldHaveItemCount(1)
        .shouldContainItem(product.displayName)
    })

    it('should display multiple items in cart', () => {
      const product1 = products.products[0]
      const product2 = products.products[1]
      
      productsPage
        .addProductToCart(product1.name)
        .addProductToCart(product2.name)
        .openCart()
      
      cartPage
        .shouldBeOnCartPage()
        .shouldHaveItemCount(2)
        .shouldContainItem(product1.displayName)
        .shouldContainItem(product2.displayName)
    })

    it('should remove item from cart', () => {
      const product = products.products[0]
      
      productsPage
        .addProductToCart(product.name)
        .openCart()
      
      cartPage
        .shouldBeOnCartPage()
        .shouldHaveItemCount(1)
        .removeItem(product.name)
        .shouldHaveItemCount(0)
        .shouldNotContainItem(product.displayName)
    })

    it('should continue shopping from cart', () => {
      const product = products.products[0]
      
      productsPage
        .addProductToCart(product.name)
        .openCart()
      
      cartPage
        .shouldBeOnCartPage()
        .continueShopping()
      
      productsPage.shouldBeOnProductsPage()
    })
  })

  describe('Cart Item Details', () => {
    beforeEach(() => {
      const product = products.products[0]
      productsPage
        .addProductToCart(product.name)
        .openCart()
    })

    it('should display correct item price', () => {
      const product = products.products[0]
      
      cartPage
        .getItemPrice(product.displayName)
        .should('contain.text', product.price)
    })

    it('should display correct item quantity', () => {
      const product = products.products[0]
      
      cartPage
        .getItemQuantity(product.displayName)
        .should('contain.text', '1')
    })
  })

  describe('Mobile Cart Tests', () => {
    beforeEach(() => {
      cy.setMobileViewport()
    })

    it('should display cart correctly on mobile', { tags: '@mobile' }, () => {
      const product = products.products[0]
      
      productsPage
        .addProductToCart(product.name)
        .openCart()
      
      cartPage
        .shouldBeOnCartPage()
        .shouldHaveItemCount(1)
        .shouldContainItem(product.displayName)
    })

    it('should remove items from cart on mobile', { tags: '@mobile' }, () => {
      const product = products.products[0]
      
      productsPage
        .addProductToCart(product.name)
        .openCart()
      
      cartPage
        .shouldBeOnCartPage()
        .removeItem(product.name)
        .shouldHaveItemCount(0)
    })
  })
})

import LoginPage from '../pages/LoginPage'
import ProductsPage from '../pages/ProductsPage'
import CartPage from '../pages/CartPage'

describe('Products Functionality', () => {
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

    // Login before each test
    loginPage.visit()
    const user = users.validUsers.standard_user
    loginPage.login(user.username, user.password)
    productsPage.shouldBeOnProductsPage()
  })

  describe('Product Display and Navigation', () => {
    it('should display all products correctly', { tags: '@smoke' }, () => {
      productsPage
        .shouldHaveProductCount(6)
        .shouldHaveProduct('Sauce Labs Backpack')
        .shouldHaveProduct('Sauce Labs Bike Light')
    })

    it('should sort products by name A to Z', () => {
      productsPage.sortProducts('az')
      
      cy.get('.inventory_item_name').then(($items) => {
        const names = [...$items].map(item => item.innerText)
        const sortedNames = [...names].sort()
        expect(names).to.deep.equal(sortedNames)
      })
    })

    it('should sort products by name Z to A', () => {
      productsPage.sortProducts('za')
      
      cy.get('.inventory_item_name').then(($items) => {
        const names = [...$items].map(item => item.innerText)
        const sortedNames = [...names].sort().reverse()
        expect(names).to.deep.equal(sortedNames)
      })
    })

    it('should sort products by price low to high', () => {
      productsPage.sortProducts('lohi')
      
      cy.get('.inventory_item_price').then(($prices) => {
        const prices = [...$prices].map(item => parseFloat(item.innerText.replace('$', '')))
        const sortedPrices = [...prices].sort((a, b) => a - b)
        expect(prices).to.deep.equal(sortedPrices)
      })
    })

    it('should navigate to product detail page', () => {
      const product = products.products[0]
      productsPage.clickProduct(product.displayName)
      
      cy.url().should('include', '/inventory-item.html')
      cy.get('.inventory_details_name').should('contain.text', product.displayName)
    })
  })

  describe('Add to Cart Functionality', () => {
    it('should add single product to cart', { tags: '@smoke' }, () => {
      const product = products.products[0]
      
      productsPage
        .addProductToCart(product.name)
        .shouldShowCartBadge(1)
    })

    it('should add multiple products to cart', () => {
      const product1 = products.products[0]
      const product2 = products.products[1]
      
      productsPage
        .addProductToCart(product1.name)
        .addProductToCart(product2.name)
        .shouldShowCartBadge(2)
    })

    it('should remove product from cart', () => {
      const product = products.products[0]
      
      productsPage
        .addProductToCart(product.name)
        .shouldShowCartBadge(1)
        .removeProductFromCart(product.name)
        .shouldShowCartBadge(0)
    })

    it('should navigate to cart page', () => {
      const product = products.products[0]
      
      productsPage
        .addProductToCart(product.name)
        .openCart()
      
      cartPage.shouldBeOnCartPage()
    })
  })

  describe('Mobile Product Tests', () => {
    beforeEach(() => {
      cy.setMobileViewport()
    })

    it('should display products correctly on mobile', { tags: '@mobile' }, () => {
      productsPage.shouldHaveProductCount(6)
    })

    it('should add product to cart on mobile', { tags: '@mobile' }, () => {
      const product = products.products[0]
      
      productsPage
        .addProductToCart(product.name)
        .shouldShowCartBadge(1)
    })

    it('should sort products on mobile', { tags: '@mobile' }, () => {
      productsPage.sortProducts('za')
      
      cy.get('.inventory_item_name').then(($items) => {
        const names = [...$items].map(item => item.innerText)
        const sortedNames = [...names].sort().reverse()
        expect(names).to.deep.equal(sortedNames)
      })
    })
  })
})

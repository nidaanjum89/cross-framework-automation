const { By, until } = require('selenium-webdriver');

class CartPage {
  constructor(driver) {
    this.driver = driver;
    
    // Locators
    this.pageTitle = By.css('.title');
    this.cartItems = By.css('.cart_item');
    this.cartItemNames = By.css('.inventory_item_name');
    this.cartItemPrices = By.css('.inventory_item_price');
    this.cartQuantities = By.css('.cart_quantity');
    this.removeButtons = By.css('[data-test^="remove"]');
    this.continueShoppingButton = By.css('[data-test="continue-shopping"]');
    this.checkoutButton = By.css('[data-test="checkout"]');
  }

  async shouldBeOnCartPage() {
    await this.driver.wait(until.urlContains('/cart.html'), 5000);
    const title = await this.driver.findElement(this.pageTitle);
    await this.driver.wait(until.elementTextContains(title, 'Your Cart'), 5000);
    return this;
  }

  async removeItem(productName) {
    const removeButton = await this.driver.findElement(By.css(`[data-test="remove-${productName}"]`));
    await removeButton.click();
    return this;
  }

  async continueShopping() {
    await this.driver.findElement(this.continueShoppingButton).click();
    return this;
  }

  async proceedToCheckout() {
    await this.driver.findElement(this.checkoutButton).click();
    return this;
  }

  async shouldHaveItemCount(count) {
    const items = await this.driver.findElements(this.cartItems);
    if (items.length !== count) {
      throw new Error(`Expected ${count} items in cart, but found ${items.length}`);
    }
    return this;
  }

  async shouldContainItem(productName) {
    const itemElements = await this.driver.findElements(this.cartItemNames);
    let found = false;
    for (let element of itemElements) {
      const text = await element.getText();
      if (text === productName) {
        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error(`Item "${productName}" not found in cart`);
    }
    return this;
  }

  async shouldNotContainItem(productName) {
    const itemElements = await this.driver.findElements(this.cartItemNames);
    for (let element of itemElements) {
      const text = await element.getText();
      if (text === productName) {
        throw new Error(`Item "${productName}" should not be in cart but was found`);
      }
    }
    return this;
  }

  async getItemPrice(productName) {
    const cartItems = await this.driver.findElements(this.cartItems);
    for (let item of cartItems) {
      const nameElement = await item.findElement(By.css('.inventory_item_name'));
      const name = await nameElement.getText();
      if (name === productName) {
        const priceElement = await item.findElement(By.css('.inventory_item_price'));
        return await priceElement.getText();
      }
    }
    throw new Error(`Item "${productName}" not found in cart`);
  }

  async getItemQuantity(productName) {
    const cartItems = await this.driver.findElements(this.cartItems);
    for (let item of cartItems) {
      const nameElement = await item.findElement(By.css('.inventory_item_name'));
      const name = await nameElement.getText();
      if (name === productName) {
        const quantityElement = await item.findElement(By.css('.cart_quantity'));
        return await quantityElement.getText();
      }
    }
    throw new Error(`Item "${productName}" not found in cart`);
  }
}

module.exports = CartPage;

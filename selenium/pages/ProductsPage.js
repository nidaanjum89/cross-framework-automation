const { By, until } = require('selenium-webdriver');

class ProductsPage {
  constructor(driver) {
    this.driver = driver;
    
    // Locators
    this.pageTitle = By.css('.title');
    this.menuButton = By.css('#react-burger-menu-btn');
    this.logoutLink = By.css('#logout_sidebar_link');
    this.cartIcon = By.css('.shopping_cart_link');
    this.cartBadge = By.css('.shopping_cart_badge');
    this.sortDropdown = By.css('.product_sort_container');
    this.inventoryItems = By.css('.inventory_item');
    this.inventoryItemNames = By.css('.inventory_item_name');
    this.inventoryItemPrices = By.css('.inventory_item_price');
    this.addToCartButtons = By.css('[data-test^="add-to-cart"]');
    this.removeButtons = By.css('[data-test^="remove"]');
  }

  async shouldBeOnProductsPage() {
    await this.driver.wait(until.urlContains('/inventory.html'), 5000);
    const title = await this.driver.findElement(this.pageTitle);
    await this.driver.wait(until.elementTextContains(title, 'Products'), 5000);
    return this;
  }

  async addProductToCart(productName) {
    const addButton = await this.driver.findElement(By.css(`[data-test="add-to-cart-${productName}"]`));
    await addButton.click();
    return this;
  }

  async removeProductFromCart(productName) {
    const removeButton = await this.driver.findElement(By.css(`[data-test="remove-${productName}"]`));
    await removeButton.click();
    return this;
  }

  async clickProduct(productName) {
    const productElements = await this.driver.findElements(this.inventoryItemNames);
    for (let element of productElements) {
      const text = await element.getText();
      if (text === productName) {
        await element.click();
        break;
      }
    }
    return this;
  }

  async sortProducts(sortOption) {
    const dropdown = await this.driver.findElement(this.sortDropdown);
    await dropdown.click();
    const option = await this.driver.findElement(By.css(`option[value="${sortOption}"]`));
    await option.click();
    return this;
  }

  async openCart() {
    await this.driver.findElement(this.cartIcon).click();
    return this;
  }

  async logout() {
    await this.driver.findElement(this.menuButton).click();
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(this.logoutLink)), 5000);
    await this.driver.findElement(this.logoutLink).click();
    return this;
  }

  async shouldHaveProductCount(count) {
    const items = await this.driver.findElements(this.inventoryItems);
    if (items.length !== count) {
      throw new Error(`Expected ${count} products, but found ${items.length}`);
    }
    return this;
  }

  async shouldShowCartBadge(count) {
    if (count > 0) {
      const badge = await this.driver.findElement(this.cartBadge);
      await this.driver.wait(until.elementIsVisible(badge), 5000);
      const badgeText = await badge.getText();
      if (badgeText !== count.toString()) {
        throw new Error(`Expected cart badge to show ${count}, but got ${badgeText}`);
      }
    } else {
      const badges = await this.driver.findElements(this.cartBadge);
      if (badges.length > 0) {
        const isVisible = await badges[0].isDisplayed();
        if (isVisible) {
          throw new Error('Expected cart badge to not be visible when count is 0');
        }
      }
    }
    return this;
  }

  async shouldHaveProduct(productName) {
    const productElements = await this.driver.findElements(this.inventoryItemNames);
    let found = false;
    for (let element of productElements) {
      const text = await element.getText();
      if (text === productName) {
        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error(`Product "${productName}" not found on the page`);
    }
    return this;
  }

  async getProductNames() {
    const elements = await this.driver.findElements(this.inventoryItemNames);
    const names = [];
    for (let element of elements) {
      names.push(await element.getText());
    }
    return names;
  }

  async getProductPrices() {
    const elements = await this.driver.findElements(this.inventoryItemPrices);
    const prices = [];
    for (let element of elements) {
      const priceText = await element.getText();
      prices.push(parseFloat(priceText.replace('$', '')));
    }
    return prices;
  }
}

module.exports = ProductsPage;

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');

class WebDriverManager {
  static async createDriver() {
    const browser = process.env.BROWSER || 'chrome';
    const headless = process.env.HEADLESS === 'true';
    
    let driver;
    
    switch (browser.toLowerCase()) {
      case 'chrome':
        const chromeOptions = new chrome.Options();
        if (headless) {
          chromeOptions.addArguments('--headless');
        }
        chromeOptions.addArguments('--no-sandbox');
        chromeOptions.addArguments('--disable-dev-shm-usage');
        chromeOptions.addArguments('--disable-gpu');
        chromeOptions.addArguments('--window-size=1920,1080');
        
        driver = await new Builder()
          .forBrowser('chrome')
          .setChromeOptions(chromeOptions)
          .build();
        break;
        
      case 'firefox':
        const firefoxOptions = new firefox.Options();
        if (headless) {
          firefoxOptions.addArguments('--headless');
        }
        firefoxOptions.addArguments('--width=1920');
        firefoxOptions.addArguments('--height=1080');
        
        driver = await new Builder()
          .forBrowser('firefox')
          .setFirefoxOptions(firefoxOptions)
          .build();
        break;
        
      case 'edge':
        const edgeOptions = new edge.Options();
        if (headless) {
          edgeOptions.addArguments('--headless');
        }
        edgeOptions.addArguments('--no-sandbox');
        edgeOptions.addArguments('--disable-dev-shm-usage');
        edgeOptions.addArguments('--window-size=1920,1080');
        
        driver = await new Builder()
          .forBrowser('MicrosoftEdge')
          .setEdgeOptions(edgeOptions)
          .build();
        break;
        
      default:
        throw new Error(`Unsupported browser: ${browser}`);
    }
    
    await driver.manage().setTimeouts({ implicit: 10000 });
    return driver;
  }
  
  static async createMobileDriver() {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');
    chromeOptions.addArguments('--disable-gpu');
    
    // Mobile viewport simulation
    const mobileEmulation = {
      deviceMetrics: {
        width: 375,
        height: 667,
        pixelRatio: 2.0
      },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    };
    chromeOptions.setMobileEmulation(mobileEmulation);
    
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
      
    await driver.manage().setTimeouts({ implicit: 10000 });
    return driver;
  }
}

module.exports = WebDriverManager;

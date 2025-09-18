# 🚀 Cross-Framework Test Automation Suite

A comprehensive testing solution combining **Cypress**, **Playwright**, and **Selenium** with unified **Allure reporting** for complete test coverage and beautiful visual dashboards.

## 🎯 Features

- **Cross-Framework Testing**: Identical test scenarios across Cypress, Playwright, and Selenium
- **Unified Allure Reports**: Single dashboard combining all framework results
- **Page Object Model**: Consistent architecture across all frameworks
- **Mobile Testing**: Responsive design validation
- **Test Categorization**: Organized by tags (@smoke, @mobile, @e2e, @negative)
- **Performance Metrics**: Execution times and trend analysis
- **Visual Reporting**: Screenshots and videos on failures

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Java** (for Allure CLI)
- **Allure CLI**: `npm install -g allure-commandline`

## 🛠️ Quick Setup

```bash
# Install all dependencies
npm run install:all

# Or install individually
npm run install:cypress
npm run install:playwright
npm run install:selenium
```

## 🧪 Running Tests

### Individual Framework Testing

```bash
# Cypress Tests
npm run cypress:run          # Headless execution
npm run cypress:open         # Interactive mode

# Playwright Tests  
npm run playwright:test      # All tests
npm run playwright:headed    # With browser UI

# Selenium Tests
npm run selenium:test        # All tests
```

### Cross-Framework Execution

```bash
# Run all frameworks sequentially
npm run test:all

# Run all with Allure reporting
npm run test:all:allure
```

## 📊 Generating Reports

### Unified Allure Reports

```bash
# Complete test execution + unified report
npm run report:generate

# Generate report from existing results
npm run allure:generate

# Serve live report (recommended)
npm run allure:serve

# Open static report
npm run allure:open
```

### Framework-Specific Reports

```bash
# Individual Allure reports
npm run cypress:allure
npm run playwright:allure  
npm run selenium:allure
```

## 🏗️ Project Structure

```
├── cypress/           # Cypress tests and configuration
│   ├── e2e/          # Test specifications
│   ├── pages/        # Page Object Models
│   └── fixtures/     # Test data
├── playwright/        # Playwright tests and configuration
│   ├── tests/        # Test specifications
│   ├── pages/        # Page Object Models
│   └── fixtures/     # Test data
├── selenium/          # Selenium tests and configuration
│   ├── tests/        # Test specifications
│   ├── pages/        # Page Object Models
│   └── fixtures/     # Test data
├── allure-results/    # Combined test results
└── allure-report/     # Generated unified reports
```

## 🏷️ Test Categories

- **@smoke**: Critical functionality tests
- **@mobile**: Mobile responsive tests
- **@e2e**: End-to-end user journeys
- **@negative**: Error handling validation

## 📈 Report Features

The unified Allure dashboard provides:

- **Overview**: High-level metrics across all frameworks
- **Suites**: Framework-specific test organization
- **Categories**: Functional test groupings
- **Timeline**: Execution flow visualization
- **Graphs**: Statistical analysis and trends
- **Behaviors**: BDD-style feature mapping

## 🎨 Test Scenarios

All frameworks test identical e-commerce scenarios:

1. **Login Functionality**: Valid/invalid credentials, locked users
2. **Product Management**: Browsing, filtering, sorting
3. **Shopping Cart**: Add/remove items, quantity updates
4. **Checkout Process**: Form validation, order completion
5. **Mobile Responsiveness**: Cross-device compatibility

## 🚀 Quick Start

```bash
# 1. Setup project
git clone <repository>
npm run install:all

# 2. Run complete test suite with reports
npm run report:generate

# 3. View beautiful unified dashboard
npm run allure:serve
```

## 📝 Commands Reference

| Command | Description |
|---------|-------------|
| `npm run report:generate` | **🎯 Complete test execution + unified report** |
| `npm run allure:serve` | **📊 Launch live report dashboard** |
| `npm run test:all` | Run all frameworks |
| `npm run cypress:run` | Cypress headless |
| `npm run playwright:test` | Playwright tests |
| `npm run selenium:test` | Selenium tests |

---

**🎉 Ready to explore comprehensive cross-framework testing with beautiful unified reporting!**

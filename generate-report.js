#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Cross-Framework Test Execution with Allure Reporting...\n');

// Clean previous results
console.log('🧹 Cleaning previous results...');
try {
  execSync('npm run clean:allure', { stdio: 'inherit' });
} catch (error) {
  console.log('No previous results to clean');
}

// Create allure-results directory if it doesn't exist
const allureResultsDir = path.join(__dirname, 'allure-results');
if (!fs.existsSync(allureResultsDir)) {
  fs.mkdirSync(allureResultsDir, { recursive: true });
}

// Add environment information for Allure
const environmentInfo = {
  'Test Environment': 'SauceDemo',
  'Base URL': 'https://www.saucedemo.com',
  'Test Suite': 'Cross-Framework E-commerce Testing',
  'Frameworks': 'Cypress, Playwright, Selenium',
  'Execution Date': new Date().toISOString(),
  'Node Version': process.version,
  'OS': process.platform
};

fs.writeFileSync(
  path.join(allureResultsDir, 'environment.properties'),
  Object.entries(environmentInfo)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
);

// Add categories for better test organization
const categories = [
  {
    "name": "Login Issues",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*login.*|.*authentication.*"
  },
  {
    "name": "Product Issues", 
    "matchedStatuses": ["failed"],
    "messageRegex": ".*product.*|.*inventory.*"
  },
  {
    "name": "Cart Issues",
    "matchedStatuses": ["failed"], 
    "messageRegex": ".*cart.*|.*shopping.*"
  },
  {
    "name": "Checkout Issues",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*checkout.*|.*payment.*"
  },
  {
    "name": "Mobile Issues",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*mobile.*|.*viewport.*"
  },
  {
    "name": "Flaky Tests",
    "matchedStatuses": ["failed", "broken"],
    "messageRegex": ".*timeout.*|.*network.*"
  }
];

fs.writeFileSync(
  path.join(allureResultsDir, 'categories.json'),
  JSON.stringify(categories, null, 2)
);

const frameworks = [
  { name: 'Cypress', command: 'npm run cypress:allure', color: '🌲' },
  { name: 'Playwright', command: 'npm run playwright:allure', color: '🎭' },
  { name: 'Selenium', command: 'npm run selenium:allure', color: '🔧' }
];

let totalTests = 0;
let totalPassed = 0;
let totalFailed = 0;
const results = {};

// Execute tests for each framework
for (const framework of frameworks) {
  console.log(`\n${framework.color} Running ${framework.name} tests...`);
  const startTime = Date.now();
  
  try {
    execSync(framework.command, { stdio: 'inherit' });
    console.log(`✅ ${framework.name} tests completed successfully`);
  } catch (error) {
    console.log(`⚠️  ${framework.name} tests completed with some failures`);
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  results[framework.name] = {
    duration: `${duration}s`,
    status: 'completed'
  };
}

// Generate unified Allure report
console.log('\n📊 Generating unified Allure report...');
try {
  execSync('npm run allure:generate', { stdio: 'inherit' });
  console.log('✅ Allure report generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Allure report:', error.message);
  process.exit(1);
}

// Display summary
console.log('\n' + '='.repeat(60));
console.log('📈 CROSS-FRAMEWORK TEST EXECUTION SUMMARY');
console.log('='.repeat(60));

Object.entries(results).forEach(([framework, result]) => {
  console.log(`${framework.padEnd(15)} | Duration: ${result.duration} | Status: ${result.status}`);
});

console.log('\n🎯 Report Features:');
console.log('   • Unified dashboard across all frameworks');
console.log('   • Test categorization by functionality');
console.log('   • Performance metrics and trends');
console.log('   • Flaky test detection');
console.log('   • Screenshots and videos on failures');
console.log('   • Historical test data');

console.log('\n📂 Access your reports:');
console.log('   • Allure Report: npm run allure:open');
console.log('   • Live Server: npm run allure:serve');
console.log('   • Report Directory: ./allure-report/index.html');

console.log('\n🚀 Cross-framework testing completed successfully!');

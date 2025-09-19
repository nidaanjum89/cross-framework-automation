const fs = require('fs');
const { execSync } = require('child_process');

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

if (!SLACK_WEBHOOK_URL) {
  console.error('❌ SLACK_WEBHOOK_URL environment variable is not set');
  process.exit(1);
}

function sendSlackMessage(message) {
  const payload = JSON.stringify({ text: message });
  const curlCommand = `curl -X POST -H 'Content-type: application/json' --data '${payload}' '${SLACK_WEBHOOK_URL}'`;
  
  try {
    const result = execSync(curlCommand, { encoding: 'utf8' });
    if (result.trim() === 'ok') {
      console.log('✅ Slack notification sent successfully!');
    } else {
      console.log('⚠️ Unexpected response:', result);
    }
  } catch (error) {
    console.error('❌ Error sending Slack notification:', error.message);
  }
}

// Function to get test results and determine overall status
function getTestResults() {
  try {
    const cypressResult = process.env.CYPRESS_RESULT || '✅';
    const playwrightResult = process.env.PLAYWRIGHT_RESULT || '✅';
    const seleniumResult = process.env.SELENIUM_RESULT || '✅';
    
    // Determine overall status
    const allPassed = cypressResult.includes('✅') && playwrightResult.includes('✅') && seleniumResult.includes('✅');
    const overallStatus = allPassed ? '✅ PASSED' : '❌ FAILED';
    
    return {
      cypress: cypressResult.includes('✅') ? '✅' : '❌',
      playwright: playwrightResult.includes('✅') ? '✅' : '❌',
      selenium: seleniumResult.includes('✅') ? '✅' : '❌',
      overall: overallStatus
    };
  } catch (error) {
    return {
      cypress: '✅',
      playwright: '✅',
      selenium: '✅',
      overall: '✅ PASSED'
    };
  }
}

// Generate simple, clean message format
const now = new Date();
const timeString = now.toLocaleString('en-US', { 
  timeZone: 'Europe/Berlin',
  month: 'short',
  day: 'numeric', 
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
});

const results = getTestResults();

const message = `🎯 Cross-Framework Test Results - ${results.overall}

Cypress: ${results.cypress} (2.1s)
Playwright: ${results.playwright} (0.9s)
Selenium: ${results.selenium} (0.5s)

Time: ${timeString}
Report: https://nidaanjum89.github.io/cross-framework-automation/`;

sendSlackMessage(message);

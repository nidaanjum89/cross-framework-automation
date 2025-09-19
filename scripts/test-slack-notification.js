const { execSync } = require('child_process');

// Use the Slack webhook URL from environment variable or fallback to provided URL
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/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';

console.log('🔗 Using webhook URL:', SLACK_WEBHOOK_URL.substring(0, 50) + '...');

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

// Test message with current timestamp
const now = new Date();
const timestamp = now.toLocaleString('en-US', { 
  timeZone: 'Europe/Berlin',
  year: 'numeric',
  month: '2-digit', 
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

const message = `🧪 Cross-Framework Test Notification - Final Test

✅ Slack integration is working correctly!

🕐 Test Time: ${timestamp} (Berlin Time)

📊 Test Summary:
• Cypress: Ready for testing
• Playwright: Ready for testing
• Selenium: Ready for testing

🔗 Repository: https://github.com/nidaanjum89/cross-framework-automation

✨ All Slack notification scripts are now properly configured and tested!`;

console.log('🚀 Sending test Slack notification...');
sendSlackMessage(message);

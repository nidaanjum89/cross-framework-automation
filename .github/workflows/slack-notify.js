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

// Simple test message
const message = process.argv[2] || '🧪 Cross-Framework Test Notification\n\nThis is a test message from the automation pipeline.';

sendSlackMessage(message);

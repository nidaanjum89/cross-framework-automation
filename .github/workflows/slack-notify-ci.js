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

// Get GitHub context from environment variables
const status = process.argv[2] || 'unknown';
const runId = process.env.GITHUB_RUN_ID || 'unknown';
const repo = process.env.GITHUB_REPOSITORY || 'cross-framework-automation';
const ref = process.env.GITHUB_REF_NAME || 'main';
const actor = process.env.GITHUB_ACTOR || 'unknown';

let emoji, statusText;
if (status === 'success') {
  emoji = '✅';
  statusText = 'SUCCESS';
} else if (status === 'failure') {
  emoji = '❌';
  statusText = 'FAILED';
} else {
  emoji = '⚠️';
  statusText = 'COMPLETED';
}

const message = `${emoji} *CI Pipeline ${statusText}*

📋 *Details:*
• Repository: ${repo}
• Branch: ${ref}
• Triggered by: ${actor}
• Run ID: ${runId}

🔗 *Links:*
• [View Run](https://github.com/${repo}/actions/runs/${runId})
• [Test Reports](https://nidaanjum89.github.io/cross-framework-automation/reports/)

_Automated notification from GitHub Actions_`;

sendSlackMessage(message);

const { execSync } = require('child_process');

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

if (!SLACK_WEBHOOK_URL) {
  console.error('❌ SLACK_WEBHOOK_URL environment variable is not set');
  process.exit(1);
}

function sendSlackNotification(status, testResults = {}) {
  const runId = process.env.GITHUB_RUN_ID || 'unknown';
  const repo = process.env.GITHUB_REPOSITORY || 'cross-framework-automation';
  const ref = process.env.GITHUB_REF_NAME || 'main';
  const actor = process.env.GITHUB_ACTOR || 'unknown';
  const workflow = process.env.GITHUB_WORKFLOW || 'CI/CD';
  
  // Determine status emoji and text
  const statusInfo = {
    success: { emoji: '✅', text: 'SUCCESS' },
    failure: { emoji: '❌', text: 'FAILED' },
    cancelled: { emoji: '⚫', text: 'CANCELLED' },
  }[status] || { emoji: '⚠️', text: 'UNKNOWN' };

  // Build test results summary if available
  let testSummary = '';
  if (Object.keys(testResults).length > 0) {
    testSummary = '\n\n📊 *Test Results:*\n' + 
      Object.entries(testResults)
        .map(([framework, result]) => `• ${framework}: ${result ? '✅' : '❌'}`)
        .join('\n');
  }

  const message = {
    text: `${statusInfo.emoji} *${workflow} ${statusInfo.text}*\n\n` +
          `📋 *Details:*\n` +
          `• Repository: ${repo}\n` +
          `• Branch: ${ref}\n` +
          `• Triggered by: ${actor}\n` +
          `• Run ID: ${runId}` +
          `${testSummary}\n\n` +
          `🔗 *Links:*\n` +
          `• <https://github.com/${repo}/actions/runs/${runId}|View Run>\n` +
          `• <https://nidaanjum89.github.io/cross-framework-automation/|View Reports>\n\n` +
          `_Automated notification from GitHub Actions_`
  };

  try {
    const result = execSync(
      `curl -X POST -H 'Content-type: application/json' --data '${JSON.stringify(message)}' '${SLACK_WEBHOOK_URL}'`,
      { encoding: 'utf8' }
    );

    if (result.trim() === 'ok') {
      console.log('✅ Slack notification sent successfully!');
    } else {
      console.error('⚠️ Unexpected response:', result);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error sending Slack notification:', error.message);
    process.exit(1);
  }
}

// Get status from command line argument
const status = process.argv[2];
if (!status) {
  console.error('❌ Status argument is required');
  process.exit(1);
}

// Get test results if provided as JSON string in third argument
let testResults = {};
try {
  if (process.argv[3]) {
    testResults = JSON.parse(process.argv[3]);
  }
} catch (error) {
  console.warn('⚠️ Warning: Invalid test results JSON provided');
}

sendSlackNotification(status, testResults);

const unhandled = require('electron-unhandled');
const { is, openNewGitHubIssue, debugInfo } = require('electron-util');
const log = require('electron-log');

const issueBody = error => `An unhandled error occured. Here's the error stack:

\`\`\`
${error.stack}
\`\`\`

---
${debugInfo()}
`;

function setupExceptionHandler() {
  unhandled({
    logger: (...args) => log.error(...args),
    showDialog: true,
    reportButton: error => {
      openNewGitHubIssue({
        user: 'sjofartstidningen',
        repo: 'bryggan-desktop',
        body: issueBody(error),
      });
    },
  });

  log.info(`Exception handler setup in ${is.renderer ? 'renderer' : 'main'}`);
}

module.exports = { setupExceptionHandler };

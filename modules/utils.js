/**
 * Simple utility module
 * Standard CommonJS exports
 */

function formatMessage(msg) {
  return `[${new Date().toISOString()}] ${msg}`;
}

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = {
  formatMessage,
  add,
  multiply
};

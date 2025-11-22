/**
 * Helper module that uses relative imports
 */

const utils = require('./utils');

function greet(name) {
  const message = `Hello, ${name}!`;
  return utils.formatMessage(message);
}

module.exports = {
  greet
};

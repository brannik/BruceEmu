/**
 * Example script demonstrating require() and global functions
 */

println('=== BruceEmu Test Script ===');

// Test global println
println('Testing println function...');

// Load and use utility module
const utils = require('utils');
println('Loaded utils module');
println(utils.formatMessage('Hello from BruceEmu!'));
println('2 + 3 =', utils.add(2, 3));
println('4 * 5 =', utils.multiply(4, 5));

// Load and execute onDevice module
println('\n--- Testing onDevice pattern ---');
const led = require('led');
const ledResult = led.onDevice();
println('LED result:', JSON.stringify(ledResult));

// Load and execute callback module
println('\n--- Testing callback pattern ---');
const display = require('display');
const displayResult = display((err, data) => {
  if (err) {
    println('Display error:', err);
  } else {
    println('Display callback received:', JSON.stringify(data));
  }
});
println('Display returned:', displayResult);

// Test setTimeout
println('\n--- Testing setTimeout ---');
setTimeout(() => {
  println('Timeout executed after 200ms');
}, 200);

println('\n=== Script execution complete ===');

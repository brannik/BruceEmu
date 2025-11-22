/**
 * Example demonstrating relative imports between modules
 */

println('=== Testing Relative Imports ===');

// Load greeter which internally loads utils with relative path
const greeter = require('greeter');

const greeting = greeter.greet('BruceEmu');
println(greeting);

println('\n=== Relative imports test complete ===');

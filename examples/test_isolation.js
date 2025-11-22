/**
 * Example script demonstrating module isolation
 */

println('=== Testing Module Isolation ===');

// Each require gets the same cached module instance
const utils1 = require('utils');
const utils2 = require('utils');

println('utils1 === utils2:', utils1 === utils2); // Should be true (same instance)

// Modules are isolated from script scope
let localVar = 'script scope';
println('localVar:', localVar);

// Test that modules don't pollute global scope
const led = require('led');
led.onDevice();

println('\n=== Isolation test complete ===');

/**
 * Example demonstrating error handling in BruceEmu
 */

println('=== Error Handling Demo ===\n');

// 1. Try to load non-existent module
println('1. Testing module not found:');
try {
  const nonExistent = require('non_existent_module');
} catch (error) {
  println('  Caught error:', error.message);
}

// 2. Script errors are caught at runtime level
println('\n2. Testing division by zero (no error in JS):');
const result = 10 / 0;
println('  Result:', result); // Infinity

// 3. Module with error in onDevice
println('\n3. Testing module with runtime error:');
try {
  const utils = require('utils');
  // This will work
  println('  Valid call:', utils.add(5, 3));
  
  // This will throw an error
  println('  Invalid call:', utils.nonExistentFunction());
} catch (error) {
  println('  Caught error:', error.message);
}

// 4. Accessing undefined variables
println('\n4. Testing undefined variable:');
try {
  const utils = require('utils');
  const formatted = utils.formatMessage(undefined);
  println('  Result with undefined:', formatted);
} catch (error) {
  println('  Caught error:', error.message);
}

println('\n=== Error Handling Demo Complete ===');

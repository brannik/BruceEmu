/**
 * Comprehensive example demonstrating all BruceEmu features
 */

println('=== BruceEmu Comprehensive Demo ===\n');

// 1. Global println function
println('1. Testing println:');
println('  Single argument:', 'Hello');
println('  Multiple arguments:', 1, 2, 3);
println('  Objects:', { name: 'BruceEmu', version: '1.0' });

// 2. CommonJS require
println('\n2. Testing CommonJS require:');
const utils = require('utils');
println('  Loaded utils module');
println('  Math operations: 10 + 5 =', utils.add(10, 5));
println('  Math operations: 10 * 5 =', utils.multiply(10, 5));

// 3. Relative imports
println('\n3. Testing relative imports:');
const greeter = require('greeter');
println(' ', greeter.greet('Developer'));

// 4. Module caching
println('\n4. Testing module caching:');
const utils2 = require('utils');
println('  Same instance:', utils === utils2);

// 5. onDevice pattern
println('\n5. Testing onDevice pattern:');
const led = require('led');
const ledResult = led.onDevice();
println('  Result:', JSON.stringify(ledResult));
led.toggle();

// 6. Callback pattern
println('\n6. Testing callback pattern:');
const display = require('display');
display((err, data) => {
  if (err) {
    println('  Error:', err);
  } else {
    println('  Display data:', JSON.stringify(data));
  }
});

// 7. setTimeout
println('\n7. Testing setTimeout:');
setTimeout(() => {
  println('  Timer 1 fired after 100ms');
}, 100);

setTimeout(() => {
  println('  Timer 2 fired after 200ms');
}, 200);

// 8. setInterval (with clearInterval)
println('\n8. Testing setInterval:');
let count = 0;
const intervalId = setInterval(() => {
  count++;
  println(`  Interval tick ${count}`);
  if (count >= 3) {
    clearInterval(intervalId);
    println('  Interval cleared');
  }
}, 50);

// 9. Script isolation - these variables won't leak to other scripts
const isolatedVar = 'This is isolated';
let mutableVar = 42;

println('\n9. Script-level variables (isolated):');
println('  isolatedVar:', isolatedVar);
println('  mutableVar:', mutableVar);

// 10. Global setTimeout for final message
setTimeout(() => {
  println('\n=== Demo Complete ===');
  println('All features demonstrated successfully!');
}, 400);

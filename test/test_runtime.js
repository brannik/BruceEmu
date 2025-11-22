/**
 * Test suite for BruceEmu Runtime
 */

const BruceRuntime = require('../bruce_runtime.js');
const fs = require('fs');
const path = require('path');

// Test counter
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

console.log('Running BruceEmu Runtime Tests...\n');

// Test 1: Runtime instantiation
test('Runtime instantiation', () => {
  const runtime = new BruceRuntime();
  assert(runtime !== null, 'Runtime should be created');
  assert(typeof runtime.runScript === 'function', 'Runtime should have runScript method');
});

// Test 2: Global context creation
test('Global context has required functions', () => {
  const runtime = new BruceRuntime();
  const context = runtime.globalContext;
  assert(typeof context.println === 'function', 'Context should have println');
  assert(typeof context.setTimeout === 'function', 'Context should have setTimeout');
  assert(typeof context.setInterval === 'function', 'Context should have setInterval');
});

// Test 3: Module style detection - onDevice
test('Detect onDevice module style', () => {
  const runtime = new BruceRuntime();
  const moduleExports = {
    onDevice: function() { return 'test'; }
  };
  const style = runtime.detectModuleStyle(moduleExports);
  assertEquals(style, 'onDevice', 'Should detect onDevice style');
});

// Test 4: Module style detection - callback
test('Detect callback module style', () => {
  const runtime = new BruceRuntime();
  const moduleExports = function(callback) { };
  const style = runtime.detectModuleStyle(moduleExports);
  assertEquals(style, 'callback', 'Should detect callback style');
});

// Test 5: Module style detection - unknown
test('Detect unknown module style', () => {
  const runtime = new BruceRuntime();
  const moduleExports = { someOther: 'value' };
  const style = runtime.detectModuleStyle(moduleExports);
  assertEquals(style, 'unknown', 'Should detect unknown style');
});

// Test 6: Run simple code
test('Run simple code with println', () => {
  const runtime = new BruceRuntime();
  let output = '';
  
  // Capture println output
  const originalLog = console.log;
  console.log = (...args) => {
    output += args.join(' ');
  };
  
  runtime.runCode('println("Hello World");');
  
  console.log = originalLog;
  assert(output.includes('Hello World'), 'Should execute println');
});

// Test 7: Run code with require
test('Run code with require', () => {
  const runtime = new BruceRuntime();
  const result = runtime.runCode(`
    const utils = require('utils');
    utils.add(2, 3);
  `);
  assertEquals(result, 5, 'Should load module and execute function');
});

// Test 8: Module caching
test('Modules are cached', () => {
  const runtime = new BruceRuntime();
  runtime.runCode(`
    const utils1 = require('utils');
    const utils2 = require('utils');
  `);
  
  const cachedModules = runtime.getCachedModules();
  const utilsModules = cachedModules.filter(m => m.includes('utils.js'));
  assertEquals(utilsModules.length, 1, 'Should cache module');
});

// Test 9: Clear cache
test('Clear module cache', () => {
  const runtime = new BruceRuntime();
  runtime.runCode(`require('utils');`);
  
  let cached = runtime.getCachedModules();
  assert(cached.length > 0, 'Should have cached modules');
  
  runtime.clearCache();
  cached = runtime.getCachedModules();
  assertEquals(cached.length, 0, 'Cache should be empty');
});

// Test 10: Execute onDevice module
test('Execute onDevice module', () => {
  const runtime = new BruceRuntime();
  const moduleExports = {
    onDevice: function(arg) { return `result: ${arg}`; }
  };
  const result = runtime.executeModule(moduleExports, ['test']);
  assertEquals(result, 'result: test', 'Should execute onDevice function');
});

// Test 11: Execute callback module
test('Execute callback module', () => {
  const runtime = new BruceRuntime();
  let callbackCalled = false;
  const moduleExports = function(callback) {
    callbackCalled = true;
    return 'done';
  };
  const result = runtime.executeModule(moduleExports);
  assert(callbackCalled, 'Should execute callback function');
  assertEquals(result, 'done', 'Should return result');
});

// Test 12: Script isolation
test('Scripts run in isolated scope', () => {
  const runtime = new BruceRuntime();
  
  // Run first script
  runtime.runCode('var testVar = "first";');
  
  // Run second script - should not see testVar from first
  try {
    runtime.runCode('testVar;');
    throw new Error('Should not have access to previous script variables');
  } catch (error) {
    assert(error.message.includes('not defined'), 'Variables should be isolated');
  }
});

// Test 13: setTimeout availability
test('setTimeout is available in scripts', () => {
  const runtime = new BruceRuntime();
  let executed = false;
  
  runtime.runCode(`
    setTimeout(() => {
      // This would execute asynchronously
    }, 10);
  `);
  
  // If no error was thrown, setTimeout is available
  assert(true, 'setTimeout should be available');
});

// Test 14: Custom context
test('Custom context is available in scripts', () => {
  const runtime = new BruceRuntime();
  const result = runtime.runCode('customValue * 2;', {
    context: { customValue: 21 }
  });
  assertEquals(result, 42, 'Custom context should be available');
});

// Test 15: Error handling in scripts
test('Error handling in scripts', () => {
  const runtime = new BruceRuntime();
  let errorThrown = false;
  
  try {
    runtime.runCode('throw new Error("test error");');
  } catch (error) {
    errorThrown = true;
    assert(error.message.includes('test error'), 'Should propagate script errors');
  }
  
  assert(errorThrown, 'Should throw error from script');
});

// Summary
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);
console.log(`Total: ${testsPassed + testsFailed}`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('\n✓ All tests passed!');
  process.exit(0);
}

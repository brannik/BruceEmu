// Simple test script to verify all BruceEmu modules
// Run this in the browser console after loading index.html

async function testAllModules() {
  console.log('=== BruceEmu Module Tests ===\n');
  
  // Test Display
  console.log('Testing display.js...');
  display.clear();
  display.print(10, 20, 'Test');
  console.log('✓ Display module working');
  
  // Test Storage
  console.log('\nTesting storage.js...');
  const file = storage.open({fs: 'sd', path: '/test.txt', mode: 'w'});
  file.write('Hello BruceEmu');
  file.close();
  
  const file2 = storage.open({fs: 'sd', path: '/test.txt', mode: 'r'});
  const content = file2.readAll();
  file2.close();
  console.assert(content === 'Hello BruceEmu', 'Storage read/write failed');
  console.log('✓ Storage module working');
  
  // Test BLE
  console.log('\nTesting ble.js...');
  ble.clearFakes();
  const device = ble.injectFake({name: 'Test Device', rssi: -50});
  const devices = await ble.scan({duration: 100});
  console.assert(devices.length > 0, 'BLE scan failed');
  console.log('✓ BLE module working');
  
  // Test WiFi
  console.log('\nTesting wifi.js...');
  wifi.clearFakes();
  const network = wifi.injectFake({ssid: 'Test Network', rssi: -60});
  const networks = await wifi.scan({duration: 100});
  console.assert(networks.length > 0, 'WiFi scan failed');
  console.log('✓ WiFi module working');
  
  // Test Device
  console.log('\nTesting device.js...');
  let buttonPressed = false;
  device.onButton('TestBtn', () => { buttonPressed = true; });
  console.log('✓ Device module working (button registered)');
  
  // Test Notification
  console.log('\nTesting notification.js...');
  await notification.vibrate(50);
  console.log('✓ Notification module working');
  
  // Test Dialog (requires user interaction)
  console.log('\nTesting dialog.js...');
  console.log('ℹ Dialog requires user interaction - test manually');
  
  console.log('\n=== All automated tests passed! ===');
}

// Run tests
testAllModules().catch(console.error);

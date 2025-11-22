// BLE module for BruceEmu
// Provides scan APIs and injectFake({...}) functionality

class BLE {
  constructor() {
    this.devices = [];
    this.scanning = false;
    this.fakeDevices = [];
  }

  async scan(options = {}) {
    const {
      duration = 5000,
      filters = {},
      onDevice = null
    } = options;

    this.scanning = true;
    this.devices = [];

    console.log('Starting BLE scan for', duration, 'ms');

    return new Promise((resolve) => {
      // Add fake devices immediately if any
      this.devices.push(...this.fakeDevices);
      
      if (onDevice && typeof onDevice === 'function') {
        this.fakeDevices.forEach(device => onDevice(device));
      }

      // Try to use Web Bluetooth API if available
      if (navigator.bluetooth) {
        const scanOptions = {};
        if (filters.services) {
          scanOptions.filters = [{ services: filters.services }];
        } else {
          scanOptions.acceptAllDevices = true;
        }

        navigator.bluetooth.requestDevice(scanOptions)
          .then(device => {
            const deviceInfo = {
              name: device.name || 'Unknown',
              id: device.id,
              rssi: -50, // Simulated RSSI
              address: device.id,
              type: 'real'
            };
            this.devices.push(deviceInfo);
            if (onDevice) onDevice(deviceInfo);
          })
          .catch(error => {
            console.log('Web Bluetooth not available or user cancelled:', error.message);
          });
      }

      setTimeout(() => {
        this.scanning = false;
        console.log('BLE scan completed, found', this.devices.length, 'devices');
        resolve(this.devices);
      }, duration);
    });
  }

  injectFake(deviceInfo) {
    const fakeDevice = {
      name: deviceInfo.name || 'Fake Device',
      id: deviceInfo.id || `fake_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      rssi: deviceInfo.rssi || -60,
      address: deviceInfo.address || deviceInfo.id || 'AA:BB:CC:DD:EE:FF',
      manufacturerData: deviceInfo.manufacturerData || null,
      serviceData: deviceInfo.serviceData || null,
      services: deviceInfo.services || [],
      type: 'fake'
    };

    this.fakeDevices.push(fakeDevice);
    console.log('Injected fake BLE device:', fakeDevice);
    return fakeDevice;
  }

  clearFakes() {
    this.fakeDevices = [];
  }

  getDevices() {
    return this.devices;
  }

  isScanning() {
    return this.scanning;
  }
}

// Export as singleton
const ble = new BLE();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ble;
}

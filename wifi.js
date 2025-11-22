// WiFi module for BruceEmu
// Provides scan APIs and injectFake({...}) functionality

class WiFi {
  constructor() {
    this.networks = [];
    this.scanning = false;
    this.fakeNetworks = [];
  }

  async scan(options = {}) {
    const {
      duration = 3000,
      onNetwork = null
    } = options;

    this.scanning = true;
    this.networks = [];

    console.log('Starting WiFi scan for', duration, 'ms');

    return new Promise((resolve) => {
      // Add fake networks immediately if any
      this.networks.push(...this.fakeNetworks);
      
      if (onNetwork && typeof onNetwork === 'function') {
        this.fakeNetworks.forEach(network => onNetwork(network));
      }

      // Simulate WiFi scanning (real WiFi scanning not available in browser)
      // In a real implementation, this would interface with device WiFi
      setTimeout(() => {
        this.scanning = false;
        console.log('WiFi scan completed, found', this.networks.length, 'networks');
        resolve(this.networks);
      }, duration);
    });
  }

  injectFake(networkInfo) {
    const fakeNetwork = {
      ssid: networkInfo.ssid || 'Fake Network',
      bssid: networkInfo.bssid || this.generateMAC(),
      rssi: networkInfo.rssi || -50,
      channel: networkInfo.channel || 6,
      encryption: networkInfo.encryption || 'WPA2',
      hidden: networkInfo.hidden || false,
      type: 'fake'
    };

    this.fakeNetworks.push(fakeNetwork);
    console.log('Injected fake WiFi network:', fakeNetwork);
    return fakeNetwork;
  }

  generateMAC() {
    const hex = '0123456789ABCDEF';
    let mac = '';
    for (let i = 0; i < 6; i++) {
      if (i > 0) mac += ':';
      mac += hex[Math.floor(Math.random() * 16)];
      mac += hex[Math.floor(Math.random() * 16)];
    }
    return mac;
  }

  clearFakes() {
    this.fakeNetworks = [];
  }

  getNetworks() {
    return this.networks;
  }

  isScanning() {
    return this.scanning;
  }
}

// Export as singleton
const wifi = new WiFi();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = wifi;
}

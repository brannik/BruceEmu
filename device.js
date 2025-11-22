// Device module for BruceEmu
// Provides bleScan(options), wifiScan(options), onButton(name, cb)

class Device {
  constructor() {
    this.buttonCallbacks = new Map();
    this.buttonElements = new Map();
    this.bleModule = null;
    this.wifiModule = null;
  }

  init() {
    // Dynamically load BLE and WiFi modules if available
    if (typeof ble !== 'undefined') {
      this.bleModule = ble;
    }
    if (typeof wifi !== 'undefined') {
      this.wifiModule = wifi;
    }
  }

  async bleScan(options = {}) {
    this.init();
    
    if (this.bleModule && typeof this.bleModule.scan === 'function') {
      return await this.bleModule.scan(options);
    }
    
    // Fallback simulation
    console.log('BLE scan with options:', options);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, options.duration || 1000);
    });
  }

  async wifiScan(options = {}) {
    this.init();
    
    if (this.wifiModule && typeof this.wifiModule.scan === 'function') {
      return await this.wifiModule.scan(options);
    }
    
    // Fallback simulation
    console.log('WiFi scan with options:', options);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, options.duration || 1000);
    });
  }

  onButton(name, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    this.buttonCallbacks.set(name, callback);

    // Create or get button element
    if (!this.buttonElements.has(name)) {
      const button = document.createElement('button');
      button.textContent = name;
      button.style.cssText = `
        padding: 10px 20px;
        margin: 5px;
        font-size: 14px;
        border: 2px solid #333;
        border-radius: 4px;
        background: #f0f0f0;
        cursor: pointer;
      `;
      button.onmouseover = () => button.style.background = '#e0e0e0';
      button.onmouseout = () => button.style.background = '#f0f0f0';
      button.onclick = () => {
        const cb = this.buttonCallbacks.get(name);
        if (cb) cb();
      };

      // Add to button container or create one
      let container = document.getElementById('button-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'button-container';
        container.style.cssText = `
          position: fixed;
          bottom: 10px;
          left: 10px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #ccc;
          border-radius: 4px;
          z-index: 1000;
        `;
        document.body.appendChild(container);
      }
      container.appendChild(button);
      this.buttonElements.set(name, button);
    }
  }

  removeButton(name) {
    this.buttonCallbacks.delete(name);
    
    if (this.buttonElements.has(name)) {
      const button = this.buttonElements.get(name);
      if (button.parentNode) {
        button.parentNode.removeChild(button);
      }
      this.buttonElements.delete(name);
    }
  }
}

// Export as singleton
const device = new Device();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = device;
}

/**
 * BruceEmu - Emulator for BruceJS scripts
 * Emulates BLE, WiFi, and hardware button devices for testing scripts in browser
 */

// Main emulator object
const emulator = {
    // Device storage
    bleDevices: [],
    wifiNetworks: [],
    
    // Script execution state
    isRunning: false,
    scriptContext: null,
    
    // Callbacks
    bleCallbacks: [],
    wifiCallbacks: [],
    buttonCallbacks: [],
    
    /**
     * Initialize the emulator
     */
    init() {
        this.log('BruceEmu initialized', 'info');
        this.log('Ready to run BruceJS scripts', 'info');
        
        // Add some default devices
        this.addDefaultDevices();
    },
    
    /**
     * Add default devices for testing
     */
    addDefaultDevices() {
        // Add some default BLE devices
        this.addBLEDevice({
            addr: 'AA:BB:CC:DD:EE:01',
            name: 'Smart Watch',
            rssi: -45
        });
        this.addBLEDevice({
            addr: 'AA:BB:CC:DD:EE:02',
            name: 'Fitness Tracker',
            rssi: -62
        });
        
        // Add some default WiFi networks
        this.addWiFiNetwork({
            ssid: 'HomeNetwork',
            bssid: '00:11:22:33:44:01',
            channel: 6,
            rssi: -35,
            security: 'WPA2'
        });
        this.addWiFiNetwork({
            ssid: 'Office_WiFi',
            bssid: '00:11:22:33:44:02',
            channel: 11,
            rssi: -58,
            security: 'WPA2-Enterprise'
        });
        
        this.updateUI();
    },
    
    /**
     * Add a BLE device
     */
    addBLEDevice(device) {
        this.bleDevices.push(device);
        this.updateUI();
        
        // Trigger callbacks if any are registered
        this.bleCallbacks.forEach(callback => {
            try {
                callback(device);
            } catch (e) {
                this.log('Error in BLE callback: ' + e.message, 'error');
            }
        });
    },
    
    /**
     * Add a WiFi network
     */
    addWiFiNetwork(network) {
        this.wifiNetworks.push(network);
        this.updateUI();
        
        // Trigger callbacks if any are registered
        this.wifiCallbacks.forEach(callback => {
            try {
                callback(network);
            } catch (e) {
                this.log('Error in WiFi callback: ' + e.message, 'error');
            }
        });
    },
    
    /**
     * Generate random BLE device
     */
    addRandomBLE() {
        const names = ['Smart Watch', 'Fitness Tracker', 'Headphones', 'Keyboard', 'Mouse', 'Phone', 'Tablet', 'Speaker'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomAddr = Array(6).fill(0).map(() => 
            Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
        ).join(':');
        const randomRSSI = -Math.floor(Math.random() * 70 + 30); // -30 to -100
        
        this.addBLEDevice({
            addr: randomAddr,
            name: randomName,
            rssi: randomRSSI
        });
    },
    
    /**
     * Generate random WiFi network
     */
    addRandomWiFi() {
        const ssids = ['HomeNet', 'Office_WiFi', 'Guest_Network', 'MyRouter', 'FastInternet', 'SecureNet'];
        const securities = ['WPA2', 'WPA3', 'WPA', 'Open', 'WPA2-Enterprise'];
        const randomSSID = ssids[Math.floor(Math.random() * ssids.length)] + '_' + Math.floor(Math.random() * 1000);
        const randomBSSID = Array(6).fill(0).map(() => 
            Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
        ).join(':');
        const randomChannel = [1, 6, 11][Math.floor(Math.random() * 3)];
        const randomRSSI = -Math.floor(Math.random() * 70 + 30);
        const randomSecurity = securities[Math.floor(Math.random() * securities.length)];
        
        this.addWiFiNetwork({
            ssid: randomSSID,
            bssid: randomBSSID,
            channel: randomChannel,
            rssi: randomRSSI,
            security: randomSecurity
        });
    },
    
    /**
     * Clear BLE devices
     */
    clearBLE() {
        this.bleDevices = [];
        this.updateUI();
        this.log('BLE devices cleared', 'info');
    },
    
    /**
     * Clear WiFi networks
     */
    clearWiFi() {
        this.wifiNetworks = [];
        this.updateUI();
        this.log('WiFi networks cleared', 'info');
    },
    
    /**
     * Emulate hardware button press
     */
    pressButton(button) {
        this.log('Button pressed: ' + button, 'info');
        document.getElementById('button-status').textContent = `Last pressed: BTN ${button}`;
        
        // Trigger callbacks if any are registered
        this.buttonCallbacks.forEach(callback => {
            try {
                callback(button);
            } catch (e) {
                this.log('Error in button callback: ' + e.message, 'error');
            }
        });
    },
    
    /**
     * Update UI displays
     */
    updateUI() {
        // Update BLE devices display
        const bleContainer = document.getElementById('ble-devices');
        bleContainer.innerHTML = this.bleDevices.map(device => `
            <div class="device-item">
                <strong>${device.name}</strong><br>
                Addr: ${device.addr}<br>
                RSSI: ${device.rssi} dBm
            </div>
        `).join('');
        
        // Update WiFi networks display
        const wifiContainer = document.getElementById('wifi-networks');
        wifiContainer.innerHTML = this.wifiNetworks.map(network => `
            <div class="device-item">
                <strong>${network.ssid}</strong><br>
                BSSID: ${network.bssid}<br>
                Channel: ${network.channel} | RSSI: ${network.rssi} dBm<br>
                Security: ${network.security}
            </div>
        `).join('');
    },
    
    /**
     * Log message to console
     */
    log(message, level = 'log') {
        const consoleOutput = document.getElementById('console-output');
        const line = document.createElement('div');
        line.className = `console-line ${level}`;
        const timestamp = new Date().toLocaleTimeString();
        line.textContent = `[${timestamp}] ${message}`;
        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    },
    
    /**
     * Clear console output
     */
    clearConsole() {
        document.getElementById('console-output').innerHTML = '';
        this.log('Console cleared', 'info');
    },
    
    /**
     * Create the BruceJS API environment
     */
    createScriptEnvironment() {
        const self = this;
        
        // BLE module
        const bleModule = {
            onDevice(callback) {
                self.bleCallbacks.push(callback);
                self.log('BLE onDevice callback registered', 'info');
            },
            scan() {
                self.log('BLE scan() called', 'info');
                // Trigger callbacks for existing devices
                self.bleDevices.forEach(device => {
                    self.bleCallbacks.forEach(callback => {
                        try {
                            callback(device);
                        } catch (e) {
                            self.log('Error in BLE callback: ' + e.message, 'error');
                        }
                    });
                });
                return self.bleDevices;
            },
            stop() {
                self.log('BLE scan stopped', 'info');
                self.bleCallbacks = [];
            }
        };
        
        // WiFi module
        const wifiModule = {
            onScan(callback) {
                self.wifiCallbacks.push(callback);
                self.log('WiFi onScan callback registered', 'info');
            },
            scan() {
                self.log('WiFi scan() called', 'info');
                // Trigger callbacks for existing networks
                self.wifiNetworks.forEach(network => {
                    self.wifiCallbacks.forEach(callback => {
                        try {
                            callback(network);
                        } catch (e) {
                            self.log('Error in WiFi callback: ' + e.message, 'error');
                        }
                    });
                });
                return self.wifiNetworks;
            },
            stop() {
                self.log('WiFi scan stopped', 'info');
                self.wifiCallbacks = [];
            }
        };
        
        // Device module
        const deviceModule = {
            onButton(buttonOrCallback, callback) {
                // If called with 2 args: specific button and callback
                if (typeof buttonOrCallback === 'string' && typeof callback === 'function') {
                    self.buttonCallbacks.push((pressedButton) => {
                        if (pressedButton === buttonOrCallback) {
                            callback(pressedButton);
                        }
                    });
                    self.log(`Button callback registered for BTN ${buttonOrCallback}`, 'info');
                }
                // If called with 1 arg: callback for all buttons
                else if (typeof buttonOrCallback === 'function') {
                    self.buttonCallbacks.push(buttonOrCallback);
                    self.log('Button callback registered for all buttons', 'info');
                }
                // Handle invalid arguments
                else {
                    const error = 'Invalid arguments for device.onButton(). Expected: onButton(callback) or onButton(button, callback)';
                    self.log(error, 'error');
                    throw new Error(error);
                }
            }
        };
        
        // Global functions
        const println = (...args) => {
            self.log(args.join(' '));
        };
        
        const print = (...args) => {
            self.log(args.join(' '));
        };
        
        // require() function to load modules
        const require = (moduleName) => {
            switch (moduleName) {
                case 'ble':
                    return bleModule;
                case 'wifi':
                    return wifiModule;
                case 'device':
                    return deviceModule;
                default:
                    throw new Error('Module not found: ' + moduleName);
            }
        };
        
        return {
            require,
            println,
            print
        };
    },
    
    /**
     * Run the script from the editor
     */
    runScript() {
        const scriptEditor = document.getElementById('script-editor');
        const script = scriptEditor.value;
        
        if (this.isRunning) {
            this.log('Script is already running. Stop it first.', 'warn');
            return;
        }
        
        // Clear previous callbacks
        this.bleCallbacks = [];
        this.wifiCallbacks = [];
        this.buttonCallbacks = [];
        
        this.isRunning = true;
        this.log('=== Running Script ===', 'info');
        
        try {
            // Create the script environment
            const env = this.createScriptEnvironment();
            
            // Create a function with the script code
            const scriptFunction = new Function(
                'require', 'println', 'print',
                script
            );
            
            // Execute the script
            scriptFunction(env.require, env.println, env.print);
            
            this.log('=== Script Execution Complete ===', 'info');
        } catch (e) {
            this.log('Script Error: ' + e.message, 'error');
            this.log('Stack: ' + e.stack, 'error');
        } finally {
            this.isRunning = false;
        }
    },
    
    /**
     * Stop the running script
     */
    stopScript() {
        if (!this.isRunning) {
            this.log('No script is currently running', 'warn');
            return;
        }
        
        this.isRunning = false;
        this.bleCallbacks = [];
        this.wifiCallbacks = [];
        this.buttonCallbacks = [];
        
        this.log('Script stopped', 'info');
    },
    
    /**
     * Load example scripts
     */
    loadExample(type) {
        const scriptEditor = document.getElementById('script-editor');
        
        if (type === 'ble') {
            scriptEditor.value = `// BLE Tracker Example
const ble = require('ble');

println('Starting BLE tracker...');
println('Scanning for BLE devices...');

// Register callback for each discovered device
ble.onDevice(function(device) {
    println('📱 BLE Device Found:');
    println('  Name: ' + device.name);
    println('  Address: ' + device.addr);
    println('  RSSI: ' + device.rssi + ' dBm');
    println('---');
});

// Start scanning
ble.scan();

println('BLE scan started. Add devices using the UI to see them appear.');
println('Click hardware buttons to test button callbacks.');`;
        } else if (type === 'wifi') {
            scriptEditor.value = `// WiFi Tracker Example
const wifi = require('wifi');

println('Starting WiFi tracker...');
println('Scanning for WiFi networks...');

// Register callback for each discovered network
wifi.onScan(function(network) {
    println('📶 WiFi Network Found:');
    println('  SSID: ' + network.ssid);
    println('  BSSID: ' + network.bssid);
    println('  Channel: ' + network.channel);
    println('  RSSI: ' + network.rssi + ' dBm');
    println('  Security: ' + network.security);
    println('---');
});

// Start scanning
wifi.scan();

println('WiFi scan started. Add networks using the UI to see them appear.');`;
        }
        
        this.log('Example loaded: ' + type, 'info');
    }
};

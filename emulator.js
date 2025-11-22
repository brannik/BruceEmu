// BruceEmu - Bruce JS Interpreter Emulator
class BruceEmulator {
    constructor() {
        this.isRunning = false;
        this.currentScript = null;
        this.bleDevices = [];
        this.wifiNetworks = [];
        this.scriptTimeout = null;
        
        this.init();
    }

    init() {
        // Console elements
        this.consoleOutput = document.getElementById('console');
        this.displayOutput = document.getElementById('display');
        
        // Script controls
        this.scriptDropdown = document.getElementById('scriptDropdown');
        this.runButton = document.getElementById('runScript');
        this.stopButton = document.getElementById('stopScript');
        
        // BLE controls
        this.bleDeviceName = document.getElementById('bleDeviceName');
        this.bleRSSI = document.getElementById('bleRSSI');
        this.addBLEButton = document.getElementById('addBLE');
        this.bleList = document.getElementById('bleList');
        
        // WiFi controls
        this.wifiSSID = document.getElementById('wifiSSID');
        this.wifiRSSI = document.getElementById('wifiRSSI');
        this.addWiFiButton = document.getElementById('addWiFi');
        this.wifiList = document.getElementById('wifiList');
        
        // Virtual buttons
        this.virtualButtons = document.querySelectorAll('.btn-virtual');
        
        this.setupEventListeners();
        this.updateButtonStates();
        
        // Add some default devices
        this.addDefaultDevices();
    }

    setupEventListeners() {
        // Script controls
        this.runButton.addEventListener('click', () => this.runScript());
        this.stopButton.addEventListener('click', () => this.stopScript());
        
        // BLE controls
        this.addBLEButton.addEventListener('click', () => this.addBLEDevice());
        this.bleDeviceName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addBLEDevice();
        });
        
        // WiFi controls
        this.addWiFiButton.addEventListener('click', () => this.addWiFiNetwork());
        this.wifiSSID.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addWiFiNetwork();
        });
        
        // Virtual buttons
        this.virtualButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.target.dataset.button;
                this.handleButtonPress(button);
            });
        });
    }

    addDefaultDevices() {
        // Add some default BLE devices
        this.bleDevices.push({ name: 'Smartwatch', rssi: -45 });
        this.bleDevices.push({ name: 'Headphones', rssi: -60 });
        
        // Add some default WiFi networks
        this.wifiNetworks.push({ ssid: 'HomeNetwork', rssi: -35 });
        this.wifiNetworks.push({ ssid: 'CoffeeShop_WiFi', rssi: -70 });
        
        this.renderBLEList();
        this.renderWiFiList();
    }

    println(...args) {
        const message = args.join(' ');
        const line = document.createElement('div');
        line.className = 'console-line';
        line.textContent = `> ${message}`;
        this.consoleOutput.appendChild(line);
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }

    printlnError(message) {
        const line = document.createElement('div');
        line.className = 'console-line error';
        line.textContent = `[ERROR] ${message}`;
        this.consoleOutput.appendChild(line);
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }

    printlnSuccess(message) {
        const line = document.createElement('div');
        line.className = 'console-line success';
        line.textContent = `[SUCCESS] ${message}`;
        this.consoleOutput.appendChild(line);
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }

    printlnInfo(message) {
        const line = document.createElement('div');
        line.className = 'console-line info';
        line.textContent = `[INFO] ${message}`;
        this.consoleOutput.appendChild(line);
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }

    displayPrint(text) {
        this.displayOutput.textContent += text;
        this.displayOutput.scrollTop = this.displayOutput.scrollHeight;
    }

    displayClear() {
        this.displayOutput.textContent = '';
    }

    handleButtonPress(button) {
        this.printlnInfo(`Virtual Button ${button} pressed`);
        
        // Call device.onButton if script is running and has this handler
        if (this.isRunning && this.device && typeof this.device.onButton === 'function') {
            try {
                this.device.onButton(button);
            } catch (error) {
                this.printlnError(`Error in onButton handler: ${error.message}`);
            }
        }
    }

    addBLEDevice() {
        const name = this.bleDeviceName.value.trim();
        const rssi = parseInt(this.bleRSSI.value) || -65;
        
        if (!name) {
            this.printlnError('Please enter a device name');
            return;
        }
        
        this.bleDevices.push({ name, rssi });
        this.bleDeviceName.value = '';
        this.renderBLEList();
        this.printlnSuccess(`Added BLE device: ${name} (${rssi} dBm)`);
    }

    removeBLEDevice(index) {
        const device = this.bleDevices[index];
        this.bleDevices.splice(index, 1);
        this.renderBLEList();
        this.printlnInfo(`Removed BLE device: ${device.name}`);
    }

    updateBLERSSI(index, rssi) {
        this.bleDevices[index].rssi = parseInt(rssi);
        this.printlnInfo(`Updated ${this.bleDevices[index].name} RSSI to ${rssi} dBm`);
    }

    renderBLEList() {
        if (this.bleDevices.length === 0) {
            this.bleList.innerHTML = '<div class="empty-state">No BLE devices</div>';
            return;
        }
        
        this.bleList.innerHTML = '';
        this.bleDevices.forEach((device, index) => {
            const item = document.createElement('div');
            item.className = 'device-item';
            item.innerHTML = `
                <div class="device-info">
                    <span class="device-name">${device.name}</span>
                    <div class="device-rssi">
                        <span class="rssi-value">RSSI:</span>
                        <input type="number" class="rssi-input" value="${device.rssi}" 
                               onchange="emulator.updateBLERSSI(${index}, this.value)">
                        <span class="rssi-value">dBm</span>
                    </div>
                </div>
                <button class="btn btn-danger" onclick="emulator.removeBLEDevice(${index})">Remove</button>
            `;
            this.bleList.appendChild(item);
        });
    }

    addWiFiNetwork() {
        const ssid = this.wifiSSID.value.trim();
        const rssi = parseInt(this.wifiRSSI.value) || -55;
        
        if (!ssid) {
            this.printlnError('Please enter an SSID');
            return;
        }
        
        this.wifiNetworks.push({ ssid, rssi });
        this.wifiSSID.value = '';
        this.renderWiFiList();
        this.printlnSuccess(`Added WiFi network: ${ssid} (${rssi} dBm)`);
    }

    removeWiFiNetwork(index) {
        const network = this.wifiNetworks[index];
        this.wifiNetworks.splice(index, 1);
        this.renderWiFiList();
        this.printlnInfo(`Removed WiFi network: ${network.ssid}`);
    }

    updateWiFiRSSI(index, rssi) {
        this.wifiNetworks[index].rssi = parseInt(rssi);
        this.printlnInfo(`Updated ${this.wifiNetworks[index].ssid} RSSI to ${rssi} dBm`);
    }

    renderWiFiList() {
        if (this.wifiNetworks.length === 0) {
            this.wifiList.innerHTML = '<div class="empty-state">No WiFi networks</div>';
            return;
        }
        
        this.wifiList.innerHTML = '';
        this.wifiNetworks.forEach((network, index) => {
            const item = document.createElement('div');
            item.className = 'device-item';
            item.innerHTML = `
                <div class="device-info">
                    <span class="device-name">${network.ssid}</span>
                    <div class="device-rssi">
                        <span class="rssi-value">RSSI:</span>
                        <input type="number" class="rssi-input" value="${network.rssi}" 
                               onchange="emulator.updateWiFiRSSI(${index}, this.value)">
                        <span class="rssi-value">dBm</span>
                    </div>
                </div>
                <button class="btn btn-danger" onclick="emulator.removeWiFiNetwork(${index})">Remove</button>
            `;
            this.wifiList.appendChild(item);
        });
    }

    updateButtonStates() {
        this.runButton.disabled = this.isRunning || !this.scriptDropdown.value;
        this.stopButton.disabled = !this.isRunning;
    }

    // Create device API for scripts
    createDeviceAPI() {
        const self = this;
        return {
            onButton: null, // Script can override this
            
            display: {
                clear: () => self.displayClear(),
                print: (text) => self.displayPrint(text),
                println: (text) => self.displayPrint(text + '\n')
            },
            
            ble: {
                scan: (callback) => {
                    self.println('Starting BLE scan...');
                    self.bleDevices.forEach(device => {
                        callback({
                            name: device.name,
                            rssi: device.rssi,
                            address: `AA:BB:CC:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}`
                        });
                    });
                    self.printlnSuccess(`Found ${self.bleDevices.length} BLE devices`);
                },
                
                getDevices: () => {
                    return self.bleDevices.map(device => ({
                        name: device.name,
                        rssi: device.rssi
                    }));
                }
            },
            
            wifi: {
                scan: (callback) => {
                    self.println('Starting WiFi scan...');
                    self.wifiNetworks.forEach(network => {
                        callback({
                            ssid: network.ssid,
                            rssi: network.rssi,
                            channel: Math.floor(Math.random() * 11) + 1,
                            security: ['OPEN', 'WPA2', 'WPA3'][Math.floor(Math.random() * 3)]
                        });
                    });
                    self.printlnSuccess(`Found ${self.wifiNetworks.length} WiFi networks`);
                },
                
                getNetworks: () => {
                    return self.wifiNetworks.map(network => ({
                        ssid: network.ssid,
                        rssi: network.rssi
                    }));
                }
            }
        };
    }

    getScriptCode(scriptName) {
        const scripts = {
            hello: `
// Hello World Script
println("Hello from BruceEmu!");
println("This is a test script.");
device.display.clear();
device.display.println("=== Hello World ===");
device.display.println("");
device.display.println("Welcome to BruceEmu!");
println("Script completed successfully.");
            `,
            
            blink: `
// LED Blink Simulation
println("Starting LED blink simulation...");
device.display.clear();
device.display.println("=== LED Blink ===");

let count = 0;
const blinkInterval = setInterval(() => {
    count++;
    const state = count % 2 === 0 ? "ON" : "OFF";
    println(\`LED is \${state}\`);
    device.display.println(\`Blink \${count}: LED \${state}\`);
    
    if (count >= 10) {
        clearInterval(blinkInterval);
        println("Blink simulation complete.");
    }
}, 500);
            `,
            
            scan: `
// WiFi Scanner Script
println("WiFi Scanner started");
device.display.clear();
device.display.println("=== WiFi Scanner ===");
device.display.println("");

device.wifi.scan((network) => {
    println(\`Found: \${network.ssid} (\${network.rssi} dBm)\`);
    device.display.println(\`\${network.ssid}\`);
    device.display.println(\`  RSSI: \${network.rssi} dBm\`);
    device.display.println(\`  Ch: \${network.channel} | \${network.security}\`);
    device.display.println("");
});

println("WiFi scan complete!");
            `,
            
            ble: `
// BLE Scanner Script
println("BLE Scanner started");
device.display.clear();
device.display.println("=== BLE Scanner ===");
device.display.println("");

device.ble.scan((device_data) => {
    println(\`Found: \${device_data.name} (\${device_data.rssi} dBm)\`);
    device.display.println(\`\${device_data.name}\`);
    device.display.println(\`  RSSI: \${device_data.rssi} dBm\`);
    device.display.println(\`  MAC: \${device_data.address}\`);
    device.display.println("");
});

// Set up button handler
device.onButton = (button) => {
    println(\`Button \${button} pressed - rescanning...\`);
    device.display.clear();
    device.display.println("=== Rescanning... ===");
    setTimeout(() => {
        device.ble.scan((device_data) => {
            device.display.println(\`\${device_data.name}: \${device_data.rssi}dBm\`);
        });
    }, 100);
};

println("BLE scan complete! Press buttons to rescan.");
            `
        };
        
        return scripts[scriptName] || '';
    }

    async runScript() {
        const scriptName = this.scriptDropdown.value;
        if (!scriptName) {
            this.printlnError('Please select a script');
            return;
        }
        
        this.isRunning = true;
        this.updateButtonStates();
        
        // Clear console
        this.consoleOutput.innerHTML = '';
        this.printlnInfo(`Starting script: ${scriptName}`);
        this.printlnInfo('----------------------------');
        
        // Create device API
        this.device = this.createDeviceAPI();
        
        // Get script code
        const scriptCode = this.getScriptCode(scriptName);
        
        try {
            // Create script context with device API and println
            const scriptContext = {
                device: this.device,
                println: (...args) => this.println(...args),
                setTimeout: setTimeout.bind(window),
                setInterval: setInterval.bind(window),
                clearTimeout: clearTimeout.bind(window),
                clearInterval: clearInterval.bind(window)
            };
            
            // Execute script in context
            const scriptFunction = new Function(...Object.keys(scriptContext), scriptCode);
            scriptFunction(...Object.values(scriptContext));
            
            this.printlnInfo('----------------------------');
            this.printlnSuccess('Script execution completed');
            
        } catch (error) {
            this.printlnError(`Script error: ${error.message}`);
            console.error(error);
        }
    }

    stopScript() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.device = null;
        this.updateButtonStates();
        
        this.printlnInfo('----------------------------');
        this.printlnInfo('Script stopped by user');
    }
}

// Initialize emulator when page loads
let emulator;
document.addEventListener('DOMContentLoaded', () => {
    emulator = new BruceEmulator();
    
    // Enable script dropdown change listener
    emulator.scriptDropdown.addEventListener('change', () => {
        emulator.updateButtonStates();
    });
});

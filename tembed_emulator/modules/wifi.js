// WiFi Module - Provides WiFi scanning and management API
class WiFiModule {
    constructor(emulator) {
        this.emulator = emulator;
        this.scanning = false;
        this.networks = [];
        this.scanCallback = null;
        this.scanInterval = null;
        this.connected = false;
        this.currentNetwork = null;
    }
    
    // Start WiFi scan (promise-based)
    async scan(duration = 5000) {
        return new Promise((resolve) => {
            this.emulator.log('Starting WiFi scan...', 'info');
            this.networks = [];
            this.scanning = true;
            
            // Simulate network discovery
            const simulateNetworks = () => {
                const ssids = [
                    'HomeNetwork',
                    'Office_WiFi',
                    'CoffeeShop_Guest',
                    'MyRouter',
                    'TP-Link_5G',
                    'NETGEAR_2.4G',
                    'Linksys',
                    'WiFi_Network'
                ];
                
                const network = {
                    ssid: ssids[Math.floor(Math.random() * ssids.length)] + '_' + Math.floor(Math.random() * 100),
                    bssid: this.generateMacAddress(),
                    rssi: -Math.floor(Math.random() * 70) - 30,
                    channel: Math.floor(Math.random() * 11) + 1,
                    security: this.getRandomSecurity(),
                    timestamp: Date.now()
                };
                
                // Avoid duplicates
                if (!this.networks.find(n => n.bssid === network.bssid)) {
                    this.networks.push(network);
                    this.emulator.log(
                        `Found WiFi: ${network.ssid} (Ch:${network.channel}) RSSI: ${network.rssi} dBm [${network.security}]`,
                        'info'
                    );
                    
                    if (this.scanCallback) {
                        this.scanCallback(network);
                    }
                }
            };
            
            // Discover networks at intervals
            this.scanInterval = setInterval(simulateNetworks, 800);
            
            // Stop after duration
            setTimeout(() => {
                this.stopScan();
                this.emulator.log(`WiFi scan completed. Found ${this.networks.length} networks.`, 'success');
                resolve(this.networks);
            }, duration);
        });
    }
    
    // Start WiFi scan with callback
    scanWithCallback(callback, duration = 5000) {
        this.scanCallback = callback;
        return this.scan(duration);
    }
    
    // Stop WiFi scan
    stopScan() {
        this.scanning = false;
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
        this.scanCallback = null;
        this.emulator.log('WiFi scan stopped', 'info');
    }
    
    // Get discovered networks
    getNetworks() {
        return [...this.networks];
    }
    
    // Connect to network (simulated)
    async connect(ssid, password = '') {
        this.emulator.log(`Connecting to WiFi: ${ssid}`, 'info');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const network = this.networks.find(n => n.ssid === ssid);
                if (network) {
                    this.connected = true;
                    this.currentNetwork = network;
                    this.emulator.log(`Connected to ${ssid}`, 'success');
                    resolve(true);
                } else {
                    this.emulator.log('Network not found', 'error');
                    resolve(false);
                }
            }, 2000);
        });
    }
    
    // Disconnect from network
    disconnect() {
        if (this.connected) {
            this.emulator.log(`Disconnected from ${this.currentNetwork.ssid}`, 'info');
            this.connected = false;
            this.currentNetwork = null;
        }
    }
    
    // Check connection status
    isConnected() {
        return this.connected;
    }
    
    // Get current network info
    getCurrentNetwork() {
        return this.currentNetwork ? { ...this.currentNetwork } : null;
    }
    
    // Get signal strength
    getSignalStrength() {
        if (this.currentNetwork) {
            return this.currentNetwork.rssi;
        }
        return -100;
    }
    
    // Get IP address (simulated)
    getIPAddress() {
        if (this.connected) {
            return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        }
        return null;
    }
    
    // Scan for specific SSID
    async scanForSSID(ssid, timeout = 10000) {
        this.emulator.log(`Scanning for specific SSID: ${ssid}`, 'info');
        
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            const checkNetwork = () => {
                const found = this.networks.find(n => n.ssid === ssid);
                if (found) {
                    resolve(found);
                } else if (Date.now() - startTime > timeout) {
                    resolve(null);
                } else {
                    setTimeout(checkNetwork, 500);
                }
            };
            
            this.scan(timeout).then(() => {
                checkNetwork();
            });
        });
    }
    
    // Generate MAC address
    generateMacAddress() {
        return this.generateRandomMacAddress();
    }
    
    // Shared utility for MAC address generation
    generateRandomMacAddress() {
        const segments = [];
        for (let i = 0; i < 6; i++) {
            segments.push(Math.floor(Math.random() * 256).toString(16).padStart(2, '0'));
        }
        return segments.join(':').toUpperCase();
    }
    
    // Get random security type
    getRandomSecurity() {
        const types = ['OPEN', 'WEP', 'WPA', 'WPA2', 'WPA3'];
        return types[Math.floor(Math.random() * types.length)];
    }
    
    // Stop module
    stop() {
        this.stopScan();
        this.disconnect();
    }
}

// BLE Module - Provides Bluetooth Low Energy API
class BLEModule {
    constructor(emulator) {
        this.emulator = emulator;
        this.scanning = false;
        this.devices = [];
        this.scanCallback = null;
        this.scanInterval = null;
    }
    
    // Start BLE scan (promise-based)
    async scan(duration = 5000) {
        return new Promise((resolve) => {
            this.emulator.log('Starting BLE scan...', 'info');
            this.devices = [];
            this.scanning = true;
            
            // Simulate device discovery
            const simulateDevices = () => {
                const deviceTypes = [
                    'Smart Watch',
                    'Fitness Tracker',
                    'Headphones',
                    'Smart Lock',
                    'Temperature Sensor',
                    'Heart Rate Monitor'
                ];
                
                const device = {
                    id: this.generateUUID(),
                    name: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
                    rssi: -Math.floor(Math.random() * 80) - 20,
                    address: this.generateMacAddress(),
                    services: this.generateServices(),
                    timestamp: Date.now()
                };
                
                this.devices.push(device);
                this.emulator.log(`Found BLE device: ${device.name} (${device.address}) RSSI: ${device.rssi}`, 'info');
                
                if (this.scanCallback) {
                    this.scanCallback(device);
                }
            };
            
            // Discover devices at intervals
            this.scanInterval = setInterval(simulateDevices, 1000);
            
            // Stop after duration
            setTimeout(() => {
                this.stopScan();
                this.emulator.log(`BLE scan completed. Found ${this.devices.length} devices.`, 'success');
                resolve(this.devices);
            }, duration);
        });
    }
    
    // Start BLE scan with callback
    scanWithCallback(callback, duration = 5000) {
        this.scanCallback = callback;
        return this.scan(duration);
    }
    
    // Stop BLE scan
    stopScan() {
        this.scanning = false;
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
        this.scanCallback = null;
        this.emulator.log('BLE scan stopped', 'info');
    }
    
    // Get discovered devices
    getDevices() {
        return [...this.devices];
    }
    
    // Connect to device (simulated)
    async connect(deviceId) {
        this.emulator.log(`Connecting to BLE device: ${deviceId}`, 'info');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const device = this.devices.find(d => d.id === deviceId);
                if (device) {
                    device.connected = true;
                    this.emulator.log(`Connected to ${device.name}`, 'success');
                    resolve(true);
                } else {
                    this.emulator.log('Device not found', 'error');
                    resolve(false);
                }
            }, 1000);
        });
    }
    
    // Disconnect from device
    async disconnect(deviceId) {
        this.emulator.log(`Disconnecting from BLE device: ${deviceId}`, 'info');
        
        const device = this.devices.find(d => d.id === deviceId);
        if (device) {
            device.connected = false;
            this.emulator.log(`Disconnected from ${device.name}`, 'success');
            return true;
        }
        return false;
    }
    
    // Read characteristic (simulated)
    async readCharacteristic(deviceId, serviceUUID, characteristicUUID) {
        this.emulator.log(`Reading characteristic ${characteristicUUID}`, 'info');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = Math.floor(Math.random() * 255);
                resolve(data);
            }, 500);
        });
    }
    
    // Write characteristic (simulated)
    async writeCharacteristic(deviceId, serviceUUID, characteristicUUID, data) {
        this.emulator.log(`Writing to characteristic ${characteristicUUID}: ${data}`, 'info');
        return true;
    }
    
    // Generate UUID
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    // Generate MAC address
    generateMacAddress() {
        const segments = [];
        for (let i = 0; i < 6; i++) {
            segments.push(Math.floor(Math.random() * 256).toString(16).padStart(2, '0'));
        }
        return segments.join(':').toUpperCase();
    }
    
    // Generate services
    generateServices() {
        const services = [
            '180A',  // Device Information
            '180F',  // Battery Service
            '1812',  // Human Interface Device
        ];
        
        const count = Math.floor(Math.random() * 3) + 1;
        return services.slice(0, count);
    }
    
    // Stop module
    stop() {
        this.stopScan();
    }
}

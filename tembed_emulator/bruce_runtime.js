// Bruce Runtime - Provides sandboxed execution environment with Bruce API
class BruceRuntime {
    constructor(emulator) {
        this.emulator = emulator;
        this.running = true;
        this.modules = {};
        this.initModules();
    }
    
    initModules() {
        // Initialize all Bruce API modules
        this.modules.display = new DisplayModule(this.emulator);
        this.modules.dialog = new DialogModule(this.emulator);
        this.modules.notification = new NotificationModule(this.emulator);
        this.modules.storage = new StorageModule();
        this.modules.device = new DeviceModule();
        this.modules.ble = new BLEModule(this.emulator);
        this.modules.wifi = new WiFiModule(this.emulator);
    }
    
    async executeScript(scriptContent) {
        try {
            // Create async sandboxed function to support top-level await
            const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
            const sandboxedFunction = new AsyncFunction(
                'display',
                'dialog',
                'notification',
                'storage',
                'device',
                'ble',
                'wifi',
                'registerButtonHandler',
                'delay',
                scriptContent
            );
            
            // Execute with Bruce API
            await sandboxedFunction.call(
                null,
                this.modules.display,
                this.modules.dialog,
                this.modules.notification,
                this.modules.storage,
                this.modules.device,
                this.modules.ble,
                this.modules.wifi,
                (key, handler) => this.emulator.registerButtonHandler(key, handler),
                (ms) => this.delay(ms)
            );
        } catch (error) {
            console.error('Script execution error:', error);
            throw error;
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    stop() {
        this.running = false;
        
        // Stop all modules
        Object.values(this.modules).forEach(module => {
            if (module.stop) {
                module.stop();
            }
        });
    }
}

// Helper function to create delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Bruce Runtime - JavaScript interpreter with sandboxed execution
 * Provides the Bruce API for scripts
 */

window.BruceRuntime = (function() {
    
    let currentScript = null;
    let scriptContext = null;
    
    // Create sandboxed context for script execution
    function createContext() {
        const context = {
            // Core modules
            display: DisplayModule.api,
            dialog: DialogModule.api,
            notification: NotificationModule.api,
            storage: StorageModule.api,
            device: DeviceModule.api,
            ble: BLEModule.api,
            wifi: WiFiModule.api,
            
            // Console functions
            console: {
                log: (...args) => window.emulatorConsole.log('log', ...args),
                error: (...args) => window.emulatorConsole.log('error', ...args),
                warn: (...args) => window.emulatorConsole.log('warn', ...args),
                info: (...args) => window.emulatorConsole.log('info', ...args)
            },
            
            // Global functions
            print: (...args) => window.emulatorConsole.log('log', ...args),
            println: (...args) => window.emulatorConsole.log('log', ...args),
            
            // Timing functions
            setTimeout: setTimeout.bind(window),
            setInterval: setInterval.bind(window),
            clearTimeout: clearTimeout.bind(window),
            clearInterval: clearInterval.bind(window),
            
            // Async support
            Promise: Promise,
            
            // Math and utilities
            Math: Math,
            Date: Date,
            JSON: JSON,
            Array: Array,
            Object: Object,
            String: String,
            Number: Number,
            Boolean: Boolean,
            
            // Script control
            exit: function() {
                throw new Error('Script exited');
            },
            
            // Expose window object for event listeners and other global access
            window: window
        };
        
        return context;
    }
    
    // Execute script in sandboxed context
    async function executeScript(scriptCode, scriptName = 'script.js') {
        try {
            window.emulatorConsole.log('info', `Starting script: ${scriptName}`);
            
            // Create context
            scriptContext = createContext();
            
            // Wrap script in async function to support top-level await
            const wrappedCode = `
                (async function() {
                    'use strict';
                    ${scriptCode}
                })();
            `;
            
            // Create function with context
            const contextKeys = Object.keys(scriptContext);
            const contextValues = contextKeys.map(key => scriptContext[key]);
            
            const scriptFunction = new Function(...contextKeys, `return ${wrappedCode}`);
            
            // Execute
            currentScript = scriptFunction(...contextValues);
            await currentScript;
            
            window.emulatorConsole.log('info', `Script completed: ${scriptName}`);
            return true;
            
        } catch (error) {
            if (error.message === 'Script exited') {
                window.emulatorConsole.log('info', `Script exited: ${scriptName}`);
            } else {
                window.emulatorConsole.log('error', `Script error: ${error.message}`);
                console.error('Script error:', error);
            }
            return false;
        } finally {
            currentScript = null;
        }
    }
    
    // Stop running script
    // Note: JavaScript functions cannot be forcibly stopped once started.
    // This sets a flag but the script will continue executing until completion.
    // Any pending timeouts/intervals will still execute.
    function stopScript() {
        if (currentScript) {
            currentScript = null;
            scriptContext = null;
            window.emulatorConsole.log('warn', 'Script stopped by user');
            return true;
        }
        return false;
    }
    
    // Check if script is running
    function isRunning() {
        return currentScript !== null;
    }
    
    return {
        executeScript: executeScript,
        stopScript: stopScript,
        isRunning: isRunning
    };
})();

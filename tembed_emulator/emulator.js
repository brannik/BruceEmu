// Emulator UI Controller
class BruceEmulator {
    constructor() {
        this.canvas = document.getElementById('display');
        this.ctx = this.canvas.getContext('2d');
        this.console = document.getElementById('console');
        this.scriptSelect = document.getElementById('scriptSelect');
        this.loadScriptBtn = document.getElementById('loadScript');
        this.stopScriptBtn = document.getElementById('stopScript');
        this.clearConsoleBtn = document.getElementById('clearConsole');
        
        this.currentScript = null;
        this.buttonHandlers = {};
        
        this.init();
    }
    
    init() {
        // Initialize display
        this.clearDisplay();
        
        // Setup console override
        this.setupConsole();
        
        // Load available scripts
        this.loadScriptList();
        
        // Setup event listeners
        this.setupEventListeners();
        
        this.log('Bruce Emulator initialized', 'success');
        this.log('Display: 320x240 pixels', 'info');
    }
    
    setupConsole() {
        const self = this;
        
        // Override console methods
        const originalLog = console.log;
        const originalInfo = console.info;
        const originalWarn = console.warn;
        const originalError = console.error;
        
        console.log = function(...args) {
            originalLog.apply(console, args);
            self.log(args.join(' '), 'log');
        };
        
        console.info = function(...args) {
            originalInfo.apply(console, args);
            self.log(args.join(' '), 'info');
        };
        
        console.warn = function(...args) {
            originalWarn.apply(console, args);
            self.log(args.join(' '), 'warn');
        };
        
        console.error = function(...args) {
            originalError.apply(console, args);
            self.log(args.join(' '), 'error');
        };
    }
    
    log(message, type = 'log') {
        const timestamp = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = type;
        line.textContent = `[${timestamp}] ${message}`;
        this.console.appendChild(line);
        this.console.scrollTop = this.console.scrollHeight;
    }
    
    clearDisplay() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    async loadScriptList() {
        try {
            // List of example scripts
            const scripts = [
                'ble_tracker.js',
                'wifi_tracker.js'
            ];
            
            this.scriptSelect.innerHTML = '<option value="">Select a script...</option>';
            
            scripts.forEach(script => {
                const option = document.createElement('option');
                option.value = `scripts/${script}`;
                option.textContent = script;
                this.scriptSelect.appendChild(option);
            });
            
            this.log(`Loaded ${scripts.length} available scripts`, 'info');
        } catch (error) {
            this.log(`Error loading script list: ${error.message}`, 'error');
        }
    }
    
    setupEventListeners() {
        // Button clicks
        document.querySelectorAll('.btn[data-key]').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.getAttribute('data-key');
                this.handleButtonPress(key);
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            const keyMap = {
                'ArrowUp': 'up',
                'ArrowDown': 'down',
                'ArrowLeft': 'left',
                'ArrowRight': 'right',
                'Enter': 'ok',
                'Escape': 'back'
            };
            
            if (keyMap[e.key]) {
                e.preventDefault();
                this.handleButtonPress(keyMap[e.key]);
            }
        });
        
        // Script loading
        this.loadScriptBtn.addEventListener('click', () => {
            const scriptPath = this.scriptSelect.value;
            if (scriptPath) {
                this.loadAndRunScript(scriptPath);
            } else {
                this.log('Please select a script first', 'warn');
            }
        });
        
        // Script stopping
        this.stopScriptBtn.addEventListener('click', () => {
            this.stopScript();
        });
        
        // Console clearing
        this.clearConsoleBtn.addEventListener('click', () => {
            this.console.innerHTML = '';
            this.log('Console cleared', 'info');
        });
    }
    
    handleButtonPress(key) {
        this.log(`Button pressed: ${key}`, 'info');
        
        // Call registered handler if exists
        if (this.buttonHandlers[key]) {
            try {
                this.buttonHandlers[key]();
            } catch (error) {
                this.log(`Error in button handler: ${error.message}`, 'error');
            }
        }
    }
    
    registerButtonHandler(key, handler) {
        this.buttonHandlers[key] = handler;
    }
    
    clearButtonHandlers() {
        this.buttonHandlers = {};
    }
    
    async loadAndRunScript(scriptPath) {
        try {
            this.log(`Loading script: ${scriptPath}`, 'info');
            
            // Stop current script if running
            this.stopScript();
            
            // Fetch script content
            const response = await fetch(scriptPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const scriptContent = await response.text();
            
            // Create sandbox and run script
            this.log('Creating sandbox environment...', 'info');
            const runtime = new BruceRuntime(this);
            
            this.currentScript = {
                path: scriptPath,
                runtime: runtime
            };
            
            this.log('Executing script...', 'info');
            await runtime.executeScript(scriptContent);
            
            this.log('Script loaded and running', 'success');
        } catch (error) {
            this.log(`Failed to load script: ${error.message}`, 'error');
            console.error(error);
        }
    }
    
    stopScript() {
        if (this.currentScript) {
            this.log(`Stopping script: ${this.currentScript.path}`, 'warn');
            
            // Stop runtime
            if (this.currentScript.runtime) {
                this.currentScript.runtime.stop();
            }
            
            // Clear button handlers
            this.clearButtonHandlers();
            
            this.currentScript = null;
            this.log('Script stopped', 'success');
        } else {
            this.log('No script is currently running', 'warn');
        }
    }
}

// Initialize emulator when page loads
let emulator;
window.addEventListener('DOMContentLoaded', () => {
    emulator = new BruceEmulator();
});

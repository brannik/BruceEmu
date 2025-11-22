/**
 * Main Emulator Logic
 * Handles UI interactions, script loading, and button events
 */

(function() {
    'use strict';
    
    // Console output management
    window.emulatorConsole = {
        log: function(type, ...args) {
            const consoleEl = document.getElementById('console');
            const message = args.map(arg => {
                if (typeof arg === 'object') {
                    return JSON.stringify(arg, null, 2);
                }
                return String(arg);
            }).join(' ');
            
            const timestamp = new Date().toLocaleTimeString();
            const div = document.createElement('div');
            div.className = type;
            div.textContent = `[${timestamp}] ${message}`;
            consoleEl.appendChild(div);
            consoleEl.scrollTop = consoleEl.scrollHeight;
        },
        
        clear: function() {
            const consoleEl = document.getElementById('console');
            consoleEl.innerHTML = '';
        }
    };
    
    // Available scripts
    const AVAILABLE_SCRIPTS = [
        { name: 'BLE Tracker', file: 'scripts/ble_tracker.js' },
        { name: 'WiFi Scanner', file: 'scripts/wifi_tracker.js' }
    ];
    
    // Initialize emulator
    function init() {
        console.log('Initializing Bruce T-Embed Emulator...');
        
        // Initialize display
        const canvas = document.getElementById('display');
        DisplayModule.init(canvas);
        
        // Load available scripts
        loadScriptList();
        
        // Setup event listeners
        setupEventListeners();
        
        // Show welcome message
        showWelcomeScreen();
        
        console.log('Emulator initialized successfully');
        window.emulatorConsole.log('info', 'Bruce T-Embed Emulator ready!');
    }
    
    // Show welcome screen
    function showWelcomeScreen() {
        const display = DisplayModule.api;
        display.clear('#000000');
        display.drawText('Bruce T-Embed Emulator', 40, 30, '#00ff00', 16);
        display.drawText('Select a script to run', 60, 100, '#ffffff', 14);
        display.drawText('Version 1.0.0', 100, 200, '#888888', 12);
        
        // Draw a border
        display.drawRect(5, 5, 310, 230, '#00ff00', false);
    }
    
    // Load script list into dropdown
    function loadScriptList() {
        const select = document.getElementById('script-select');
        select.innerHTML = '<option value="">Select a script...</option>';
        
        AVAILABLE_SCRIPTS.forEach((script, index) => {
            const option = document.createElement('option');
            option.value = script.file;
            option.textContent = script.name;
            select.appendChild(option);
        });
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Button clicks
        document.querySelectorAll('.btn[data-key]').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.getAttribute('data-key');
                handleButtonPress(key);
            });
        });
        
        // Run script
        document.getElementById('run-script').addEventListener('click', async () => {
            await runSelectedScript();
        });
        
        // Stop script
        document.getElementById('stop-script').addEventListener('click', () => {
            stopScript();
        });
        
        // Clear console
        document.getElementById('clear-console').addEventListener('click', () => {
            window.emulatorConsole.clear();
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            const keyMap = {
                'ArrowUp': 'up',
                'ArrowDown': 'down',
                'ArrowLeft': 'left',
                'ArrowRight': 'right',
                'Enter': 'ok',
                'Escape': 'back',
                'KeyM': 'menu'
            };
            
            const mappedKey = keyMap[e.code];
            if (mappedKey) {
                e.preventDefault();
                handleButtonPress(mappedKey);
            }
        });
    }
    
    // Handle button press
    function handleButtonPress(key) {
        console.log(`Button pressed: ${key}`);
        window.emulatorConsole.log('info', `Button: ${key.toUpperCase()}`);
        
        // Emit custom event for scripts to handle
        const event = new CustomEvent('bruceButton', { detail: { key: key } });
        window.dispatchEvent(event);
    }
    
    // Run selected script
    async function runSelectedScript() {
        const select = document.getElementById('script-select');
        const scriptFile = select.value;
        
        if (!scriptFile) {
            window.emulatorConsole.log('warn', 'Please select a script first');
            return;
        }
        
        if (BruceRuntime.isRunning()) {
            window.emulatorConsole.log('warn', 'A script is already running. Stop it first.');
            return;
        }
        
        try {
            window.emulatorConsole.log('info', `Loading script: ${scriptFile}`);
            
            // Fetch script
            const response = await fetch(scriptFile);
            if (!response.ok) {
                throw new Error(`Failed to load script: ${response.statusText}`);
            }
            
            const scriptCode = await response.text();
            
            // Update UI
            document.getElementById('run-script').disabled = true;
            document.getElementById('stop-script').disabled = false;
            
            // Clear display
            DisplayModule.api.clear('#000000');
            
            // Execute script
            await BruceRuntime.executeScript(scriptCode, scriptFile);
            
        } catch (error) {
            window.emulatorConsole.log('error', `Failed to run script: ${error.message}`);
            console.error('Script execution error:', error);
        } finally {
            // Update UI
            document.getElementById('run-script').disabled = false;
            document.getElementById('stop-script').disabled = true;
        }
    }
    
    // Stop running script
    function stopScript() {
        if (BruceRuntime.stopScript()) {
            window.emulatorConsole.log('info', 'Script stopped');
            
            // Clear display
            DisplayModule.api.clear('#000000');
            showWelcomeScreen();
            
            // Update UI
            document.getElementById('run-script').disabled = false;
            document.getElementById('stop-script').disabled = true;
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

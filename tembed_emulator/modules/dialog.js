// Dialog Module - Provides dialog and user input API
class DialogModule {
    constructor(emulator) {
        this.emulator = emulator;
    }
    
    // Show alert dialog
    alert(title, message) {
        return new Promise((resolve) => {
            this.emulator.log(`ALERT: ${title} - ${message}`, 'info');
            window.alert(`${title}\n\n${message}`);
            resolve();
        });
    }
    
    // Show confirm dialog
    confirm(title, message) {
        return new Promise((resolve) => {
            this.emulator.log(`CONFIRM: ${title} - ${message}`, 'info');
            const result = window.confirm(`${title}\n\n${message}`);
            resolve(result);
        });
    }
    
    // Show prompt dialog
    prompt(title, message, defaultValue = '') {
        return new Promise((resolve) => {
            this.emulator.log(`PROMPT: ${title} - ${message}`, 'info');
            const result = window.prompt(`${title}\n\n${message}`, defaultValue);
            resolve(result);
        });
    }
    
    // Show choice dialog (multiple options)
    choice(title, options) {
        return new Promise((resolve) => {
            this.emulator.log(`CHOICE: ${title}`, 'info');
            
            let message = `${title}\n\n`;
            options.forEach((opt, idx) => {
                message += `${idx + 1}. ${opt}\n`;
            });
            message += '\nEnter the number of your choice:';
            
            const input = window.prompt(message);
            const choice = parseInt(input) - 1;
            
            if (choice >= 0 && choice < options.length) {
                resolve(choice);
            } else {
                resolve(-1);
            }
        });
    }
    
    // Show text input dialog
    input(title, placeholder = '') {
        return this.prompt(title, '', placeholder);
    }
    
    // Show message on display
    message(text, duration = 2000) {
        return new Promise((resolve) => {
            const display = this.emulator.ctx;
            
            // Clear and show message
            display.fillStyle = '#000000';
            display.fillRect(0, 0, 320, 240);
            
            display.fillStyle = '#FFFFFF';
            display.font = '16px monospace';
            
            // Word wrap
            const words = text.split(' ');
            let line = '';
            let y = 120;
            
            words.forEach(word => {
                const testLine = line + word + ' ';
                const metrics = display.measureText(testLine);
                
                if (metrics.width > 300) {
                    display.fillText(line, 10, y);
                    line = word + ' ';
                    y += 20;
                } else {
                    line = testLine;
                }
            });
            display.fillText(line, 10, y);
            
            // Auto-dismiss after duration
            setTimeout(() => {
                display.fillStyle = '#000000';
                display.fillRect(0, 0, 320, 240);
                resolve();
            }, duration);
        });
    }
}

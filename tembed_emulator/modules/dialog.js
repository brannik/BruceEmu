/**
 * Dialog Module - Provides user dialog APIs for Bruce scripts
 */

window.DialogModule = (function() {
    
    // Show alert dialog
    async function showAlert(title, message) {
        return new Promise((resolve) => {
            const result = window.confirm(`${title}\n\n${message}`);
            resolve(result);
        });
    }
    
    // Show confirm dialog
    async function showConfirm(title, message) {
        return new Promise((resolve) => {
            const result = window.confirm(`${title}\n\n${message}`);
            resolve(result);
        });
    }
    
    // Show prompt dialog
    async function showPrompt(title, message, defaultValue = '') {
        return new Promise((resolve) => {
            const result = window.prompt(`${title}\n\n${message}`, defaultValue);
            resolve(result);
        });
    }
    
    // Show choice dialog
    async function showChoice(title, options) {
        return new Promise((resolve) => {
            let message = title + '\n\n';
            options.forEach((opt, idx) => {
                message += `${idx + 1}. ${opt}\n`;
            });
            
            const input = window.prompt(message + '\nEnter choice number:', '1');
            if (input === null) {
                resolve(-1); // Cancelled
            } else {
                const choice = parseInt(input) - 1;
                resolve(choice >= 0 && choice < options.length ? choice : -1);
            }
        });
    }
    
    // API for Bruce scripts
    const api = {
        alert: showAlert,
        showAlert: showAlert,
        confirm: showConfirm,
        showConfirm: showConfirm,
        prompt: showPrompt,
        showPrompt: showPrompt,
        choice: showChoice,
        showChoice: showChoice
    };
    
    return {
        api: api
    };
})();

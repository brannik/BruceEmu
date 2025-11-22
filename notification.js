// Notification module for BruceEmu
// Provides vibrate(ms) => UI effect

class Notification {
  constructor() {
    this.indicator = null;
  }

  init() {
    if (!this.indicator) {
      this.indicator = document.createElement('div');
      this.indicator.id = 'vibration-indicator';
      this.indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 10px 20px;
        background: #ff6b6b;
        color: white;
        border-radius: 4px;
        font-weight: bold;
        display: none;
        z-index: 2000;
        animation: shake 0.1s infinite;
      `;
      
      // Add shake animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(this.indicator);
    }
  }

  vibrate(ms) {
    this.init();
    
    // Use browser vibration API if available
    if (navigator.vibrate) {
      navigator.vibrate(ms);
    }
    
    // Show visual feedback
    this.indicator.textContent = `Vibrating (${ms}ms)`;
    this.indicator.style.display = 'block';
    
    setTimeout(() => {
      this.indicator.style.display = 'none';
    }, ms);
    
    return Promise.resolve();
  }
}

// Export as singleton
const notification = new Notification();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = notification;
}

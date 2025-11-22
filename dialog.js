// Dialog module for BruceEmu
// Provides message({title,message,buttons}) => Promise

class Dialog {
  constructor() {
    this.activeDialog = null;
  }

  message({ title = 'Message', message = '', buttons = ['OK'] }) {
    return new Promise((resolve) => {
      // Remove any existing dialog
      if (this.activeDialog) {
        document.body.removeChild(this.activeDialog);
      }

      // Create dialog overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      `;

      // Create dialog box
      const dialogBox = document.createElement('div');
      dialogBox.style.cssText = `
        background: #fff;
        border: 2px solid #333;
        border-radius: 8px;
        padding: 20px;
        min-width: 250px;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      `;

      // Title
      const titleEl = document.createElement('h3');
      titleEl.textContent = title;
      titleEl.style.cssText = `
        margin: 0 0 10px 0;
        font-size: 18px;
        color: #333;
      `;
      dialogBox.appendChild(titleEl);

      // Message
      const messageEl = document.createElement('p');
      messageEl.textContent = message;
      messageEl.style.cssText = `
        margin: 0 0 20px 0;
        color: #666;
        line-height: 1.4;
      `;
      dialogBox.appendChild(messageEl);

      // Buttons container
      const buttonsContainer = document.createElement('div');
      buttonsContainer.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      `;

      // Create buttons
      buttons.forEach((buttonText, index) => {
        const button = document.createElement('button');
        button.textContent = buttonText;
        button.style.cssText = `
          padding: 8px 16px;
          border: 1px solid #333;
          border-radius: 4px;
          background: #f0f0f0;
          cursor: pointer;
          font-size: 14px;
        `;
        button.onmouseover = () => button.style.background = '#e0e0e0';
        button.onmouseout = () => button.style.background = '#f0f0f0';
        button.onclick = () => {
          document.body.removeChild(overlay);
          this.activeDialog = null;
          resolve(index);
        };
        buttonsContainer.appendChild(button);
      });

      dialogBox.appendChild(buttonsContainer);
      overlay.appendChild(dialogBox);
      document.body.appendChild(overlay);
      this.activeDialog = overlay;
    });
  }
}

// Export as singleton
const dialog = new Dialog();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dialog;
}

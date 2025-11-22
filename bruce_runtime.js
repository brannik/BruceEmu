/**
 * BruceEmu Runtime - Emulator for bruce js interpreter scripts
 * 
 * Features:
 * - CommonJS require/module.exports
 * - Load modules from modules/ directory
 * - Global println(), setTimeout/Interval
 * - Sandbox scripts with isolated scope
 * - Detect module.exports.onDevice vs callback style
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

class BruceRuntime {
  constructor(options = {}) {
    this.modulesDir = options.modulesDir || path.join(__dirname, 'modules');
    this.moduleCache = {};
    this.globalContext = this.createGlobalContext();
  }

  /**
   * Create global context with println, setTimeout, setInterval, etc.
   */
  createGlobalContext() {
    const context = {
      console: console,
      setTimeout: setTimeout.bind(global),
      setInterval: setInterval.bind(global),
      clearTimeout: clearTimeout.bind(global),
      clearInterval: clearInterval.bind(global),
      
      // Global println function
      println: (...args) => {
        console.log(...args);
      },
      
      // Process object (limited)
      process: {
        env: process.env
      }
    };
    
    return context;
  }

  /**
   * Create a require function for the given module path
   */
  createRequire(currentModulePath) {
    return (moduleName) => {
      // Resolve module path
      let modulePath;
      
      // Check if it's a relative path
      if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
        const currentDir = path.dirname(currentModulePath);
        modulePath = path.resolve(currentDir, moduleName);
      } else {
        // Load from modules/ directory
        modulePath = path.join(this.modulesDir, moduleName);
      }
      
      // Add .js extension if not present
      if (!modulePath.endsWith('.js')) {
        modulePath += '.js';
      }
      
      // Check cache
      if (this.moduleCache[modulePath]) {
        return this.moduleCache[modulePath].exports;
      }
      
      // Load and execute module
      if (!fs.existsSync(modulePath)) {
        throw new Error(`Module not found: ${moduleName} (resolved to ${modulePath})`);
      }
      
      const moduleCode = fs.readFileSync(modulePath, 'utf-8');
      
      // Create module object
      const moduleObj = {
        exports: {},
        id: modulePath,
        filename: modulePath,
        loaded: false,
        require: this.createRequire(modulePath)
      };
      
      // Cache it before execution to handle circular dependencies
      this.moduleCache[modulePath] = moduleObj;
      
      // Create sandbox for module
      const sandbox = {
        ...this.globalContext,
        require: moduleObj.require,
        module: moduleObj,
        exports: moduleObj.exports,
        __filename: modulePath,
        __dirname: path.dirname(modulePath)
      };
      
      vm.createContext(sandbox);
      
      try {
        vm.runInContext(moduleCode, sandbox, {
          filename: modulePath,
          displayErrors: true
        });
        
        moduleObj.loaded = true;
        
        // Check if module.exports was updated in sandbox
        if (sandbox.module.exports !== moduleObj.exports) {
          moduleObj.exports = sandbox.module.exports;
        }
        
        return moduleObj.exports;
      } catch (error) {
        // Remove from cache on error
        delete this.moduleCache[modulePath];
        throw error;
      }
    };
  }

  /**
   * Detect if a module uses onDevice pattern or callback style
   * 
   * onDevice pattern: module.exports = { onDevice: function() {} }
   * callback pattern: module.exports = function(callback) {}
   */
  detectModuleStyle(moduleExports) {
    if (typeof moduleExports === 'object' && moduleExports !== null) {
      if (typeof moduleExports.onDevice === 'function') {
        return 'onDevice';
      }
    }
    
    if (typeof moduleExports === 'function') {
      return 'callback';
    }
    
    return 'unknown';
  }

  /**
   * Execute a module based on its style
   */
  executeModule(moduleExports, args = []) {
    const style = this.detectModuleStyle(moduleExports);
    
    if (style === 'onDevice') {
      return moduleExports.onDevice(...args);
    } else if (style === 'callback') {
      return moduleExports(...args);
    } else {
      throw new Error('Module does not export a valid onDevice function or callback');
    }
  }

  /**
   * Run a user script in an isolated scope
   * The script has access to globals and can use require()
   */
  runScript(scriptPath, options = {}) {
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Script not found: ${scriptPath}`);
    }
    
    const scriptCode = fs.readFileSync(scriptPath, 'utf-8');
    const scriptDir = path.dirname(scriptPath);
    
    // Create isolated sandbox for the script
    const sandbox = {
      ...this.globalContext,
      require: this.createRequire(scriptPath),
      __filename: scriptPath,
      __dirname: scriptDir
    };
    
    // Add any additional context provided
    if (options.context) {
      Object.assign(sandbox, options.context);
    }
    
    vm.createContext(sandbox);
    
    try {
      const result = vm.runInContext(scriptCode, sandbox, {
        filename: scriptPath,
        displayErrors: true,
        timeout: options.timeout
      });
      
      return result;
    } catch (error) {
      console.error(`Error running script ${scriptPath}:`, error.message);
      throw error;
    }
  }

  /**
   * Run script code directly (without file)
   */
  runCode(code, options = {}) {
    const scriptPath = options.filename || '<anonymous>';
    
    // Create isolated sandbox
    const sandbox = {
      ...this.globalContext,
      require: this.createRequire(process.cwd()),
      __filename: scriptPath,
      __dirname: process.cwd()
    };
    
    // Add any additional context
    if (options.context) {
      Object.assign(sandbox, options.context);
    }
    
    vm.createContext(sandbox);
    
    try {
      const result = vm.runInContext(code, sandbox, {
        filename: scriptPath,
        displayErrors: true,
        timeout: options.timeout
      });
      
      return result;
    } catch (error) {
      console.error(`Error running code:`, error.message);
      throw error;
    }
  }

  /**
   * Clear module cache
   */
  clearCache() {
    this.moduleCache = {};
  }

  /**
   * Get cached modules
   */
  getCachedModules() {
    return Object.keys(this.moduleCache);
  }
}

// Export the runtime class
module.exports = BruceRuntime;

// If run directly, create a simple CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node bruce_runtime.js <script.js>');
    process.exit(1);
  }
  
  const scriptPath = path.resolve(args[0]);
  const runtime = new BruceRuntime();
  
  try {
    runtime.runScript(scriptPath);
  } catch (error) {
    console.error('Runtime error:', error.message);
    process.exit(1);
  }
}

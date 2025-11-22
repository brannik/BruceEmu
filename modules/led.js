/**
 * Example module using onDevice pattern
 * This is a common pattern for Bruce device scripts
 */

module.exports = {
  onDevice: function() {
    println('LED module loaded on device!');
    println('Turning on LED...');
    
    return {
      status: 'success',
      message: 'LED turned on'
    };
  },
  
  // Additional helper functions can be exported too
  toggle: function() {
    println('Toggling LED...');
  }
};

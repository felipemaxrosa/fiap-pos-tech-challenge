
const TestSequencer = require('@jest/test-sequencer').default;

class E2ETestSequencer extends TestSequencer {
    
    sort(tests) {
      return [...tests].sort((one, other) => (one.path > other.path ? 1 : -1));
    }
  }
  
  module.exports = E2ETestSequencer;
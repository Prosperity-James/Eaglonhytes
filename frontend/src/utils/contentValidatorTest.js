// Content Validator Test Suite
// This file can be run in the browser console to test the validation system

import contentValidator from './contentValidator.js';

const runContentValidatorTests = () => {
  console.log('🧪 Starting Content Validator Tests...\n');

  // Test 1: Profanity Detection
  console.log('📝 Test 1: Profanity Detection');
  const profanityTests = [
    { input: 'fuck this place', expected: false, description: 'Direct profanity' },
    { input: 'f*ck this place', expected: false, description: 'Masked profanity' },
  { input: 'This is a nice property', expected: true, description: 'Clean text' },
    { input: 'sh1t happens', expected: false, description: 'Leetspeak profanity' },
    { input: 'Hello world', expected: true, description: 'Normal greeting' }
  ];

  profanityTests.forEach((test, index) => {
    const result = contentValidator.validateContent(test.input);
    const passed = result.isValid === test.expected;
    console.log(`  ${index + 1}. ${test.description}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    if (!passed) {
      console.log(`     Expected: ${test.expected}, Got: ${result.isValid}`);
      console.log(`     Message: ${result.message}`);
    }
  });

  // Test 2: Gibberish Detection
  console.log('\n📝 Test 2: Gibberish Detection');
  const gibberishTests = [
    { input: 'LLLK', expected: false, description: 'Repeated letters' },
    { input: '###@@@', expected: false, description: 'Symbol spam' },
    { input: 'asdfghjkl', expected: false, description: 'Keyboard mashing' },
    { input: 'aaaaaaa', expected: false, description: 'Excessive repetition' },
    { input: 'Hello there', expected: true, description: 'Normal text' },
    { input: 'qwertyuiop', expected: false, description: 'Keyboard row' },
    { input: '12345678', expected: false, description: 'Number sequence' },
  { input: 'I am interested in this land', expected: true, description: 'Valid sentence' }
  ];

  gibberishTests.forEach((test, index) => {
    const result = contentValidator.validateContent(test.input);
    const passed = result.isValid === test.expected;
    console.log(`  ${index + 1}. ${test.description}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    if (!passed) {
      console.log(`     Input: "${test.input}"`);
      console.log(`     Expected: ${test.expected}, Got: ${result.isValid}`);
      console.log(`     Message: ${result.message}`);
    }
  });

  // Test 3: Edge Cases
  console.log('\n📝 Test 3: Edge Cases');
  const edgeCaseTests = [
    { input: '', expected: true, description: 'Empty string' },
    { input: '   ', expected: true, description: 'Whitespace only' },
    { input: 'A', expected: true, description: 'Single character' },
    { input: 'Hi', expected: true, description: 'Two characters' },
    { input: null, expected: true, description: 'Null input' },
    { input: undefined, expected: true, description: 'Undefined input' }
  ];

  edgeCaseTests.forEach((test, index) => {
    const result = contentValidator.validateContent(test.input);
    const passed = result.isValid === test.expected;
    console.log(`  ${index + 1}. ${test.description}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    if (!passed) {
      console.log(`     Input: "${test.input}"`);
      console.log(`     Expected: ${test.expected}, Got: ${result.isValid}`);
      console.log(`     Message: ${result.message}`);
    }
  });

  // Test 4: Multiple Field Validation
  console.log('\n📝 Test 4: Multiple Field Validation');
  const multiFieldTests = [
    {
      fields: { username: 'John Doe', email: 'john@example.com' },
      expected: true,
      description: 'Valid fields'
    },
    {
      fields: { username: 'fuck', email: 'test@example.com' },
      expected: false,
      description: 'Profanity in username'
    },
    {
      fields: { username: 'John', email: 'LLLK@example.com' },
      expected: false,
      description: 'Gibberish in email'
    },
    {
  fields: { message: 'This is a normal message', comment: 'Great property!' },
      expected: true,
      description: 'Valid message and comment'
    }
  ];

  multiFieldTests.forEach((test, index) => {
    const result = contentValidator.validateFields(test.fields);
    const passed = result.isValid === test.expected;
    console.log(`  ${index + 1}. ${test.description}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    if (!passed) {
      console.log(`     Expected: ${test.expected}, Got: ${result.isValid}`);
      console.log(`     Errors:`, result.errors);
    }
  });

  console.log('\n🎯 Content Validator Tests Complete!');
  console.log('📊 Use this in your browser console to test the validation system.');
};

// Export for use in browser console or testing
if (typeof window !== 'undefined') {
  window.runContentValidatorTests = runContentValidatorTests;
}

export default runContentValidatorTests;

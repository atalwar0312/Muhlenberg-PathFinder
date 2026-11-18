const test = require('node:test');
const assert = require('node:assert/strict');
const service = require('../pathfinder/backend/services/studentService');
test('progress counts completed courses and unmet requirements', () => {
  const result = service.getProgress('demo');
  assert.equal(result.creditsEarned, 20);
  assert.equal(result.creditsRemaining, 108);
  assert.equal(result.requirements.find(p => p.program === 'Computer Science').completed, 3);
});
test('opportunities exclude declarations, return ranked matches and cap at five', () => {
  const result = service.getOpportunities('demo');
  assert.ok(result.suggestions.length <= 5);
  assert.ok(result.suggestions.every(p => p.program !== 'Computer Science'));
  assert.ok(result.suggestions.every((p, i, arr) => i === 0 || arr[i-1].matched >= p.matched));
});
test('unknown student returns null', () => assert.equal(service.getProfile('missing'), null));

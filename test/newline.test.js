const test = require('ava')

const { collect } = require('./helpers/helper')

test('newline', async (t) => {
  const lines = await collect('option-newline', { newline: 'X' });
  t.is(lines.length, 3, '3 rows')
});

const test = require('ava')

const { collect } = require('./helpers/helper')

test('headers: false, numeric column names', async (t) => {
  const lines = await collect('basic', { headers: false });
  t.is(lines.length, 2, '2 rows')
});

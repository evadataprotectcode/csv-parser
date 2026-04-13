const test = require('ava')

const { collect } = require('./helpers/helper')

test.only('custom escape character', async (t) => {
  const lines = await collect('option-escape', { escape: '\\' });
  t.is(lines.length, 3, '3 rows')
});

test('headers: false', async (t) => {
  const lines = await collect('no-headers', { headers: false });
  t.is(lines.length, 2, '2 rows')
});

test('headers option', async (t) => {
  const lines = await collect('headers', { headers: ['a', 'b', 'c'] });
  t.is(lines.length, 3, '3 rows')
});

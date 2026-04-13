const test = require('ava')

const { collect } = require('./helpers/helper')

test('backtick separator (#105)', async (t) => {
  const lines = await collect('backtick', { separator: '`' });
  t.is(lines.length, 2, '2 rows')
});

test('strict + skipLines (#136)', async (t) => {
  const lines = await collect('strict+skipLines', { strict: true, skipLines: 1 });
  t.is(lines.length, 3, '4 rows')
});

const test = require('ava')

const { collect } = require('./helpers/helper')

test('custom quote character', async (t) => {
  const lines = await collect('option-quote', { quote: "'" });
  t.is(lines.length, 2, '2 rows')
});

test('custom quote and escape character', async (t) => {
  const lines = await collect('option-quote-escape', { quote: "'", escape: '\\' });
  t.is(lines.length, 3, '3 rows')
});

test('quote many', async (t) => {
  const lines = await collect('option-quote-many', { quote: "'" });
  t.is(lines.length, 3, '3 rows')
});

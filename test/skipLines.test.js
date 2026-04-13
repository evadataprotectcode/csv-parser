const test = require('ava')

const { collect } = require('./helpers/helper')

test('skip lines', async (t) => {
  const lines = await collect('bad-data', { skipLines: 2 });
  t.is(lines.length, 1, '1 row')
  t.is(JSON.stringify(lines[0]), JSON.stringify({ yes: 'ok', yup: 'ok', yeah: 'ok!' }))
});

test('skip lines with headers', async (t) => {
  const lines = await collect('bad-data', { headers: ['s', 'p', 'h'], skipLines: 2 });
  t.is(lines.length, 2, '2 rows')
  t.is(JSON.stringify(lines[0]), JSON.stringify({ s: 'yes', p: 'yup', h: 'yeah' }))
  t.is(JSON.stringify(lines[1]), JSON.stringify({ s: 'ok', p: 'ok', h: 'ok!' }))
});

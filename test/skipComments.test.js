const test = require('ava')

const { collect } = require('./helpers/helper')

test('comment', async (t) => {
  const lines = await collect('comment', { skipComments: true });
  t.is(lines.length, 1, '1 row')
});

test('custom comment', async (t) => {
  const lines = await collect('option-comment', { skipComments: '~' });
  t.is(lines.length, 1, '1 row')
});
const test = require('ava')

const { collect } = require('./helpers/helper')

test('maxRowBytes', async (t) => {
  const {err, lines} = await collect('option-maxRowBytes', { maxRowBytes: 200 });

  t.truthy(err)
  t.is(lines.length, 4576, '4576 rows before error')
  t.is(err.name, 'Error')
  t.is(err.message, 'Row exceeds the maximum size')
});

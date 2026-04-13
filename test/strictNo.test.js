const test = require('ava')

const { collect } = require('./helpers/helper')

test('strict: false - more columns', async (t) => {
  const lines = await collect('strict-false-more-columns', { strict: false });
  const headersFirstLine = Object.keys(lines[0])
  const headersBrokenLine = Object.keys(lines[1])
  const headersLastLine = Object.keys(lines[2])
 
  t.deepEqual(headersFirstLine, headersLastLine)
  t.deepEqual(headersBrokenLine, ['a', 'b', 'c', '_3'])
  t.is(lines.length, 3, '3 rows')
  t.is(headersBrokenLine.length, 4, '4 columns')
});

test('strict: false - less columns', async (t) => {
  const lines = await collect('strict-false-less-columns', { strict: false });
  const headersFirstLine = Object.keys(lines[0])
  const headersBrokenLine = Object.keys(lines[1])
  const headersLastLine = Object.keys(lines[2])
  t.deepEqual(headersFirstLine, headersLastLine)
  t.deepEqual(headersBrokenLine, ['a', 'b'])
  t.is(lines.length, 3, '3 rows')
  t.is(headersBrokenLine.length, 2, '2 columns')
});

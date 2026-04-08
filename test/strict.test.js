const test = require('ava')

const { collect } = require('./helpers/helper')

test('strict', async (t) => {
  const {err, lines} = await collect('strict', {strict: true});

  t.is(lines.length, 2, '2 rows')
  
  t.truthy(err)
  t.is(err.name, 'RangeError')
  t.is(err.message, 'Row length does not match headers')

});

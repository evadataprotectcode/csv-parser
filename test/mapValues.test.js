const test = require('ava')

const { collect } = require('./helpers/helper')

test('map values', async (t) => {
  const headers = []
  const indexes = []
  const mapValues = ({ header, index, value }) => {
    headers.push(header)
    indexes.push(index)
    return parseInt(value, 10)
  }

  const lines = await collect('basic', { mapValues });
  t.is(lines.length, 1, '1 row')
});

test('map last empty value', async (t) => {
  const mapValues = ({ value }) => {
    return value === '' ? null : value
  }

  const lines = await collect('empty-columns', { mapValues, headers: ['date', 'name', 'location'] });
  t.is(lines.length, 2, '2 rows')
  t.is(lines[0].name, null, 'name is mapped')
  t.is(lines[0].location, null, 'last value mapped')
});

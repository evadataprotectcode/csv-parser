const test = require('ava')

const { collect } = require('./helpers/helper')

test('rename columns', async (t) => {
  const headers = { a: 'x', b: 'y', c: 'z' }
  //eslint-disable-next-line no-unused-vars
  const mapHeaders = ({ header, _index }) => {
    return headers[header]
  }
  const lines = await collect('basic', { mapHeaders }); 
  t.is(lines.length, 1, '1 row')
})

test('skip columns a and c', async (t) => {
  //eslint-disable-next-line no-unused-vars
  const mapHeaders = ({ header, _index }) => {
    if (['a', 'c'].indexOf(header) > -1) {
      return null
    }
    return header
  }

  const lines = await collect('basic', { mapHeaders });
  t.is(lines.length, 1, '1 row')
});
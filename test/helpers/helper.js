const fs = require('fs')
const path = require('path')

const csv = require('../..')

const read = fs.createReadStream

// helpers
function fixture (name) {
  return path.join(__dirname, '../fixtures', name)
}

async function collect (file, opts) {
  //eslint-disable-next-line no-unused-vars
  return new Promise((resolve, _reject) => {
    const data = read(fixture(`${file}.csv`))
    const lines = []
    const parser = csv(opts)
    data
      .pipe(parser)
      .on('data', (line) => {
        lines.push(line)
      })
      .on('error', (err) => {
        resolve({err, lines})
      })
      .on('end', () => {
        resolve(lines)
      });
  });
}

module.exports = { collect, fixture }

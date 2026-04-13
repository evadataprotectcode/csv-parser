const path = require('path')

const test = require('ava')
const bops = require('bops')
const spectrum = require('csv-spectrum')
const concat = require('concat-stream')
const execa = require('execa')

const csv = require('..')

const { collect } = require('./helpers/helper')

const eol = '\n'

test('simple csv', async (t) => {
  const lines = await collect('basic')
  t.snapshot(lines[0], 'first row')
  t.is(lines.length, 1, '1 row')
});


test('supports strings', async (t) => {
  const parser = csv()

  const data = await new Promise((resolve) => {
    parser.once('data', resolve)
    parser.write('hello\n')
    parser.write('world\n')
    parser.end()
  })

  t.snapshot(data)
});

test('newlines in a cell', async (t) => {
  const lines = await collect('newlines');
  t.is(lines.length, 3, '3 rows')
});

test('raw escaped quotes', async (t) => {
  const lines = await collect('escape-quotes');
  t.is(lines.length, 3, '3 rows')
});

test('raw escaped quotes and newlines', async (t) => {
  const lines = await collect('quotes+newlines');
  t.is(lines.length, 3, '3 rows')
});


test('line with comma in quotes', async (t) => {
  const headers = bops.from('a,b,c,d,e\n')
  const line = bops.from('John,Doe,120 any st.,"Anytown, WW",08123\n')

  const correct = {
    a: 'John',
    b: 'Doe',
    c: '120 any st.',
    d: 'Anytown, WW',
    e: '08123'
  }

  const parser = csv()

  const data = await new Promise((resolve, reject) => {
    parser.once('data', resolve)
    parser.once('error', reject)

    parser.write(headers)
    parser.write(line)
    parser.end()
  })

  t.deepEqual(data, correct)
})


test('line with newline in quotes', async (t) => {
  const headers = bops.from('a,b,c\n')
  const line = bops.from(`1,"ha ${eol}""ha"" ${eol}ha",3\n`)

  const correct = {
    a: '1',
    b: `ha ${eol}"ha" ${eol}ha`,
    c: '3'
  }

  const parser = csv()

  const data = await new Promise((resolve, reject) => {
    parser.once('data', resolve)
    parser.once('error', reject)

    parser.write(headers)
    parser.write(line)
    parser.end()
  })

  t.deepEqual(data, correct)
})


test('cell with comma in quotes', async (t) => {
  const headers = bops.from('a\n')
  const cell = bops.from('"Anytown, WW"\n')
  const correct = 'Anytown, WW'
  const parser = csv()

  const data = await new Promise((resolve, reject) => {
    parser.once('data', resolve)
    parser.once('error', reject)

    parser.write(headers)
    parser.write(cell)
    parser.end()
  })

  t.is(data.a, correct)
})

test('cell with newline', async (t) => {
  const headers = bops.from('a\n')
  const cell = bops.from(`"why ${eol}hello ${eol}there"\n`)
  const correct = `why ${eol}hello ${eol}there`
  const parser = csv()

  const data = await new Promise((resolve, reject) => {
    parser.once('data', resolve)
    parser.once('error', reject)

    parser.write(headers)
    parser.write(cell)
    parser.end()
  })

  t.is(data.a, correct)
})

test('cell with escaped quote in quotes', async (t) => {
  const headers = bops.from('a\n')
  const cell = bops.from('"ha ""ha"" ha"\n')
  const correct = 'ha "ha" ha'
  const parser = csv()

  const data = await new Promise((resolve, reject) => {
    parser.once('data', resolve)
    parser.once('error', reject)

    parser.write(headers)
    parser.write(cell)
    parser.end()
  })

  t.is(data.a, correct)
})

test('cell with multibyte character', async (t) => {
  const headers = bops.from('a\n')
  const cell = bops.from('this ʤ is multibyte\n')
  const correct = 'this ʤ is multibyte'
  const parser = csv()

  const data = await new Promise((resolve, reject) => {
    parser.once('data', resolve)
    parser.once('error', reject)

    parser.write(headers)
    parser.write(cell)
    parser.end()
  })

  t.is(data.a, correct, 'multibyte character is preserved')
})

test('geojson', async (t) => {
  const lines = await collect('geojson');
  const lineObj = {
    type: 'LineString',
    coordinates: [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]
  }
  t.deepEqual(JSON.parse(lines[1].geojson), lineObj, 'linestrings match')
})

test('empty columns', async (t) => {
  const lines = await collect('empty-columns', ['a', 'b', 'c']);
  function testLine (row) {
    t.is(Object.keys(row).length, 3, 'Split into three columns')
    t.truthy(/^2007-01-0\d$/.test(row.a), 'First column is a date')
    t.truthy(row.b !== undefined, 'Empty column is in line')
    t.is(row.b.length, 0, 'Empty column is empty')
    t.truthy(row.c !== undefined, 'Empty column is in line')
    t.is(row.c.length, 0, 'Empty column is empty')
  }
  lines.forEach(testLine)
});


test('csv-spectrum', async (t) => {
  const data = await new Promise((resolve, reject) => {
    spectrum((err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })

  await Promise.all(
    data.map(d =>
      new Promise((resolve, reject) => {
        const parser = csv()

        const collector = concat(objs => {
          t.snapshot(objs, d.name)
          resolve()
        })

        parser
          .on('error', reject)
          .pipe(collector)

        parser.write(d.csv)
        parser.end()
      })
    )
  )
});

test('process all rows', async (t) => {
  const lines = await collect('large-dataset', {});
  t.is(lines.length, 7268, '7268 rows')
});


test('binary sanity', async (t) => {
  const binPath = path.resolve(__dirname, '../bin/csv-parser')

  const { stdout } = await execa(
    `echo "a\n1" | ${process.execPath} ${binPath}`,
    { shell: true }
  )

  const lines = stdout.trim().split('\n')

  t.is(lines.length, 1)
  t.deepEqual(JSON.parse(lines[0]), { a: '1' })
})


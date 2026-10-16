const TABLES = require('../../../app/constants/tables')
const { PRIMARY_KEYS, COLUMNS, pickColumns } = require('../../../app/constants/columns')

describe('pickColumns', () => {
  test('keeps properties that are columns on the table', () => {
    const record = { paymentReference: 1, calculationId: 'value' }

    expect(pickColumns(record, TABLES.d365)).toEqual(record)
  })

  test('drops properties that are not columns on the table', () => {
    const result = pickColumns({ paymentReference: 1, notAColumn: 'value' }, TABLES.d365)

    expect(result).toEqual({ paymentReference: 1 })
  })

  test('drops the primary key', () => {
    const result = pickColumns({ d365Id: 1, paymentReference: 1 }, TABLES.d365)

    expect(result).toEqual({ paymentReference: 1 })
  })

  test('returns an empty object when given no properties', () => {
    expect(pickColumns({}, TABLES.d365)).toEqual({})
  })
})

describe('PRIMARY_KEYS', () => {
  test('each primary key is a column on its table', () => {
    for (const [table, primaryKey] of Object.entries(PRIMARY_KEYS)) {
      expect(COLUMNS[table]).toContain(primaryKey)
    }
  })
})

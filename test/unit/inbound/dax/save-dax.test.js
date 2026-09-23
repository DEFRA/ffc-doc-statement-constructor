const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['dax'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

jest.mock('../../../../app/inbound/dax/schema', () => ({
  validate: jest.fn()
}))

const schema = require('../../../../app/inbound/dax/schema')
const validateDax = require('../../../../app/inbound/dax/validate-dax')
const saveDax = require('../../../../app/inbound/dax/save-dax')

describe('validateDax', () => {
  afterEach(() => jest.clearAllMocks())

  test('should call schema.validate with dax and options and return value if valid', () => {
    const dax = { calculationReference: 'calculationReference', otherProperty: 'otherProperty' }
    const paymentReference = 'paymentReference'

    const options = { abortEarly: false }
    schema.validate.mockReturnValueOnce({ error: null, value: dax })

    const result = validateDax(dax, paymentReference)

    expect(schema.validate).toHaveBeenCalledWith(dax, options)
    expect(result).toEqual(dax)
  })

  test('should throw error if schema.validate returns an error', () => {
    const dax = { calculationReference: 'calculationReference', otherProperty: 'otherProperty' }
    const paymentReference = 'paymentReference'

    const errorMessage = 'Validation error'
    schema.validate.mockReturnValueOnce({ error: new Error(errorMessage), value: null })

    expect(() => validateDax(dax, paymentReference)).toThrow(
      `Dax validation on paymentReference: ${paymentReference} does not have the required DAX data: ${errorMessage}`
    )
  })
})

describe('saveDax', () => {
  const transaction = mockDb.trx
  const dax = {
    paymentReference: 'PY12345',
    calculationReference: 123,
    paymentPeriod: 'Q1',
    paymentAmount: 100,
    transactionDate: '2024-01-01',
    datePublished: null,
    type: 'dax'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('inserts the dax columns with calculationReference mapped to calculationId', async () => {
    await saveDax(dax, transaction)

    expect(mockDb.tables.dax).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.insert).toHaveBeenCalledWith({
      paymentReference: 'PY12345',
      calculationId: 123,
      paymentPeriod: 'Q1',
      paymentAmount: 100,
      transactionDate: '2024-01-01',
      datePublished: null
    })
  })

  test('propagates an insert failure', async () => {
    mockDb.builder.rejects(new Error('Database error'))

    await expect(saveDax(dax, transaction)).rejects.toThrow('Database error')
  })
})

const db = require('../../../../../app/data')
const getPreviousSettlement = require('../../../../../app/processing/sfi-23-quarterly-statement/value-override/get-previous-settlement')

jest.mock('../../../../../app/data', () => ({
  settlement: {
    findOne: jest.fn()
  },
  Sequelize: {
    Op: {
      lt: Symbol('lt'),
      gt: Symbol('gt'),
      lte: Symbol('lte'),
      ne: Symbol('ne')
    }
  }
}))

describe('get previous settlement', () => {
  let mockTransaction

  beforeEach(() => {
    mockTransaction = {}
    db.settlement.findOne.mockReset()
  })

  test('should query with value less than the provided value when value is greater than 0', async () => {
    const settlementDate = new Date('2023-09-01')
    const value = 100
    const invoiceNumber = 'INV123'
    const reference = 'REF123'

    await getPreviousSettlement(settlementDate, value, invoiceNumber, reference, mockTransaction)

    expect(db.settlement.findOne).toHaveBeenCalledWith({
      transaction: mockTransaction,
      attributes: ['value'],
      where: {
        settlementDate: {
          [db.Sequelize.Op.lte]: settlementDate
        },
        value: {
          [db.Sequelize.Op.lt]: value
        },
        invoiceNumber,
        reference: {
          [db.Sequelize.Op.ne]: reference
        },
        settled: true
      },
      order: [['settlementDate', 'DESC'], ['value', 'DESC']],
      raw: true
    })
  })

  test('should query with value greater than the provided value when value is less than or equal to 0', async () => {
    const settlementDate = new Date('2023-09-01')
    const value = -50
    const invoiceNumber = 'INV123'
    const reference = 'REF123'

    await getPreviousSettlement(settlementDate, value, invoiceNumber, reference, mockTransaction)

    expect(db.settlement.findOne).toHaveBeenCalledWith({
      transaction: mockTransaction,
      attributes: ['value'],
      where: {
        settlementDate: {
          [db.Sequelize.Op.lte]: settlementDate
        },
        value: {
          [db.Sequelize.Op.gt]: value
        },
        invoiceNumber,
        reference: {
          [db.Sequelize.Op.ne]: reference
        },
        settled: true
      },
      order: [['settlementDate', 'DESC'], ['value', 'DESC']],
      raw: true
    })
  })

  test('should return the result of the query', async () => {
    const settlementDate = new Date('2023-09-01')
    const value = 100
    const invoiceNumber = 'INV123'
    const reference = 'REF123'
    const mockResult = { value: 50 }

    db.settlement.findOne.mockResolvedValue(mockResult)

    const result = await getPreviousSettlement(settlementDate, value, invoiceNumber, reference, mockTransaction)

    expect(result).toEqual(mockResult)
  })

  test('should return null if no settlement is found', async () => {
    const settlementDate = new Date('2023-09-01')
    const value = 100
    const invoiceNumber = 'INV123'
    const reference = 'REF123'

    db.settlement.findOne.mockResolvedValue(null)

    const result = await getPreviousSettlement(settlementDate, value, invoiceNumber, reference, mockTransaction)

    expect(result).toBeNull()
  })
})

const db = require('../../../../../app/data')
const getSettlementByPaymentReference = require('../../../../../app/processing/sfi-23-quarterly-statement/value-override/get-settlement-by-payment-reference')

jest.mock('../../../../../app/data', () => ({
  settlement: {
    findOne: jest.fn()
  }
}))

describe('get settlement by payment reference', () => {
  let mockTransaction

  beforeEach(() => {
    mockTransaction = {}
    db.settlement.findOne.mockReset()
  })

  test('should query the database with the correct parameters', async () => {
    const reference = 'REF123'

    await getSettlementByPaymentReference(reference, mockTransaction)

    expect(db.settlement.findOne).toHaveBeenCalledWith({
      transaction: mockTransaction,
      attributes: [
        'paymentRequestId',
        'invoiceNumber',
        'reference',
        'settled',
        'settlementDate',
        'value'
      ],
      where: {
        reference,
        settled: true
      },
      raw: true
    })
  })

  test('should return the result of the query', async () => {
    const reference = 'REF123'
    const mockResult = {
      paymentRequestId: 1,
      invoiceNumber: 'INV123',
      reference: 'REF123',
      settled: true,
      settlementDate: new Date('2023-09-01'),
      value: 100
    }

    db.settlement.findOne.mockResolvedValue(mockResult)

    const result = await getSettlementByPaymentReference(reference, mockTransaction)

    expect(result).toEqual(mockResult)
  })

  test('should return null if no settlement is found', async () => {
    const reference = 'REF123'

    db.settlement.findOne.mockResolvedValue(null)

    const result = await getSettlementByPaymentReference(reference, mockTransaction)

    expect(result).toBeNull()
  })
})

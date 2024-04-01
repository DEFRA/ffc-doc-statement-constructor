const db = require('../../../../../app/data')

const getDaxByPaymentReference = require('../../../../../app/processing/sfi-23-quarterly-statement/dax/get-dax-by-payment-reference')

test('should return the DAX record for a given payment reference', async () => {
  const paymentReference = 'ABC123'
  const expectedDaxRecord = {
    paymentReference: 'ABC123',
    calculationId: '123456',
    paymentPeriod: '2022-Q1',
    paymentAmount: 1000,
    transactionDate: '2022-01-01'
  }

  // Mock the db.dax.findOne function to return the expected DAX record
  db.dax.findOne = jest.fn().mockResolvedValue(expectedDaxRecord)

  const result = await getDaxByPaymentReference(paymentReference)

  expect(result).toEqual(expectedDaxRecord)
  expect(db.dax.findOne).toHaveBeenCalledWith({
    attributes: [
      'paymentReference',
      'calculationId',
      'paymentPeriod',
      'paymentAmount',
      'transactionDate'
    ],
    where: {
      paymentReference
    },
    raw: true
  })
})

test('should return null if no DAX record is found for the given payment reference', async () => {
  const paymentReference = 'XYZ789'

  // Mock the db.dax.findOne function to return null
  db.dax.findOne = jest.fn().mockResolvedValue(null)

  const result = await getDaxByPaymentReference(paymentReference)

  expect(result).toBeNull()
  expect(db.dax.findOne).toHaveBeenCalledWith({
    attributes: [
      'paymentReference',
      'calculationId',
      'paymentPeriod',
      'paymentAmount',
      'transactionDate'
    ],
    where: {
      paymentReference
    },
    raw: true
  })
})

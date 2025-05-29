const db = require('../../../../../app/data')

const getDaxByPaymentReference = require('../../../../../app/processing/sfi-23-quarterly-statement/dax/get-dax-by-payment-reference')

test('should return the DAX record for a given payment reference', async () => {
  const calculationId = '123456'
  const expectedDaxRecord = {
    paymentReference: 'ABC123',
    calculationId: '123456',
    paymentPeriod: '2022-Q1',
    paymentAmount: 1000,
    transactionDate: '2022-01-01'
  }

  db.dax.findOne = jest.fn().mockResolvedValue(expectedDaxRecord)

  const result = await getDaxByPaymentReference(calculationId)

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
      calculationId
    },
    raw: true
  })
})

test('should return null if no DAX record is found for the given payment reference', async () => {
  const calculationId = '567789'

  db.dax.findOne = jest.fn().mockResolvedValue(null)

  const result = await getDaxByPaymentReference(calculationId)

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
      calculationId
    },
    raw: true
  })
})

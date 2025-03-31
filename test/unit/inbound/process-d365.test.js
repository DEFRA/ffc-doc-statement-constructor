const db = require('../../../app/data')
const processD365 = require('../../../app/inbound/d365/process-d365')
const saveD365 = require('../../../app/inbound/d365/save-d365')
const validateD365 = require('../../../app/inbound/d365/validate-d365')
const getD365ByPaymentReference = require('../../../app/inbound/d365/get-d365-by-payment-reference')

jest.mock('../../../app/data')
jest.mock('../../../app/inbound/d365/save-d365')
jest.mock('../../../app/inbound/d365/schema')
jest.mock('../../../app/inbound/d365/validate-d365')
jest.mock('../../../app/inbound/d365/get-d365-by-payment-reference')

describe('processD365', () => {
  let transaction
  beforeEach(() => {
    transaction = { commit: jest.fn(), rollback: jest.fn() }
    db.sequelize.transaction.mockResolvedValue(transaction)
    jest.clearAllMocks()
  })

  test('should log info and not create transaction when d365 with same paymentReference exists', async () => {
    const d365 = { paymentReference: '123' }
    getD365ByPaymentReference.mockResolvedValue(d365)
    console.info = jest.fn()

    await processD365(d365)

    expect(console.info).toHaveBeenCalledWith(`Duplicate D365 paymentReference received, skipping ${d365.paymentReference}`)
    expect(db.sequelize.transaction).not.toHaveBeenCalled()
  })

  test('should validate, save and commit transaction when d365 with same paymentReference does not exist', async () => {
    const d365 = { paymentReference: '123', calculationReference: '456' }
    getD365ByPaymentReference.mockResolvedValue(null)
    validateD365.mockImplementation(() => { })
    saveD365.mockResolvedValue()

    await processD365(d365)

    const expectedTransformed = { paymentReference: '123', calculationId: '456' }
    expect(validateD365).toHaveBeenCalledWith(expect.objectContaining(expectedTransformed), '123')
    expect(saveD365).toHaveBeenCalledWith(expect.objectContaining(expectedTransformed), transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should handle error when looking up payment reference', async () => {
    const d365 = { paymentReference: '123' }
    const testError = new Error('Test error')
    getD365ByPaymentReference.mockRejectedValue(testError)

    db.sequelize.transaction.mockImplementation(() => {
      throw new Error('Transaction should not be created')
    })

    await expect(processD365(d365)).rejects.toEqual(testError)
  })

  test('should handle validation error without creating transaction', async () => {
    const d365 = { paymentReference: '123' }
    const validationError = new Error('Test error')
    validateD365.mockImplementation(() => { throw validationError })

    db.sequelize.transaction.mockImplementation(() => {
      throw new Error('Transaction should not be created')
    })

    await expect(processD365(d365)).rejects.toEqual(validationError)
  })

  test('should not rollback transaction when an error occurs during save', async () => {
    const d365 = { paymentReference: '123' }
    getD365ByPaymentReference.mockResolvedValue(null)
    const testError = new Error('Test error')
    saveD365.mockRejectedValue(testError)

    await expect(processD365(d365)).rejects.toEqual(testError)
    expect(transaction.rollback).not.toHaveBeenCalled()
  })
})

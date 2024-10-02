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
  })

  test('should rollback transaction and log info when d365 with same paymentReference exists', async () => {
    const d365 = { paymentReference: '123' }
    getD365ByPaymentReference.mockResolvedValue(d365)
    console.info = jest.fn()

    await processD365(d365)

    expect(console.info).toHaveBeenCalledWith(`Duplicate D365 paymentReference received, skipping ${d365.paymentReference}`)
    expect(transaction.rollback).toHaveBeenCalled()
  })

  test('should validate, save and commit transaction when d365 with same paymentReference does not exist', async () => {
    const d365 = { paymentReference: '123' }
    getD365ByPaymentReference.mockResolvedValue(null)
    validateD365.mockImplementation(() => {})
    saveD365.mockResolvedValue()

    await processD365(d365)

    expect(validateD365).toHaveBeenCalledWith(d365, d365.paymentReference)
    expect(saveD365).toHaveBeenCalledWith(d365, transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should rollback transaction when an error occurs', async () => {
    const d365 = { paymentReference: '123' }
    getD365ByPaymentReference.mockRejectedValue(new Error('Test error'))

    try {
      await processD365(d365)
    } catch (error) {
      expect(transaction.rollback).toHaveBeenCalled()
      expect(error).toEqual(new Error('Test error'))
    }
  })
  test('should throw validation error when validateD365 fails', async () => {
    const d365 = { paymentReference: '123' }
    const validationError = new Error('Test error')
    validateD365.mockImplementation(() => { throw validationError })

    try {
      await processD365(d365)
    } catch (error) {
      expect(transaction.rollback).toHaveBeenCalled()
      expect(error).toEqual(validationError)
    }
  })
})

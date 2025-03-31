const db = require('../../../app/data')
const processDax = require('../../../app/inbound/dax/process-dax')
const saveDax = require('../../../app/inbound/dax/save-dax')
const validateDax = require('../../../app/inbound/dax/validate-dax')
const getDaxByPaymentReference = require('../../../app/inbound/dax/get-dax-by-payment-reference')

jest.mock('../../../app/data')
jest.mock('../../../app/inbound/dax/save-dax')
jest.mock('../../../app/inbound/dax/schema')
jest.mock('../../../app/inbound/dax/validate-dax')
jest.mock('../../../app/inbound/dax/get-dax-by-payment-reference')

describe('processDax', () => {
  let transaction
  beforeEach(() => {
    transaction = { commit: jest.fn(), rollback: jest.fn() }
    db.sequelize.transaction.mockResolvedValue(transaction)
  })

  test('should rollback transaction and log info when dax with same paymentReference exists', async () => {
    const dax = { paymentReference: '123' }
    getDaxByPaymentReference.mockResolvedValue(dax)
    console.info = jest.fn()

    await processDax(dax)

    expect(console.info).toHaveBeenCalledWith(`Duplicate Dax paymentReference received, skipping ${dax.paymentReference}`)
    expect(db.sequelize.transaction).not.toHaveBeenCalled()
  })

  test('should validate, save and commit transaction when dax with same paymentReference does not exist', async () => {
    const dax = { paymentReference: '123' }
    getDaxByPaymentReference.mockResolvedValue(null)
    validateDax.mockImplementation(() => { })
    saveDax.mockResolvedValue()

    await processDax(dax)

    expect(validateDax).toHaveBeenCalledWith(dax, dax.paymentReference)
    expect(saveDax).toHaveBeenCalledWith(dax, transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should handle error when looking up payment reference', async () => {
    const dax = { paymentReference: '123' }
    const testError = new Error('Test error')
    getDaxByPaymentReference.mockRejectedValue(testError)

    await expect(processDax(dax)).rejects.toEqual(testError)
    expect(db.sequelize.transaction).toHaveBeenCalled()
  })

  test('should rollback transaction when an error occurs during save', async () => {
    const dax = { paymentReference: '123' }
    getDaxByPaymentReference.mockResolvedValue(null)
    saveDax.mockRejectedValue(new Error('Save error'))

    await expect(processDax(dax)).rejects.toThrow('Save error')
    expect(transaction.rollback).toHaveBeenCalled()
  })
})

process.env.RETRY_FK_MAX_RETRIES = '4'
process.env.RETRY_FK_BASE_DELAY_MS = '10'
process.env.RETRY_FK_MAX_TOTAL_DELAY_MS = '1000'
const db = require('../../../../app/data')
const processDax = require('../../../../app/inbound/dax/process-dax')
const saveDax = require('../../../../app/inbound/dax/save-dax')
const validateDax = require('../../../../app/inbound/dax/validate-dax')
const getDaxByCalculationIdAndPaymentReference = require('../../../../app/inbound/dax/get-dax-by-calculation-id-and-payment-reference')
const retryUtil = require('../../../../app/utility/retry-fk-error')

beforeAll(() => {
  jest.spyOn(retryUtil, 'sleep').mockImplementation(() => Promise.resolve())
})
afterAll(() => {
  retryUtil.sleep.mockRestore()
})

jest.mock('../../../../app/data', () => {
  return {
    sequelize: {
      transaction: jest.fn()
    },
    Sequelize: {
      ForeignKeyConstraintError: class extends Error {
        constructor (msg) {
          super(typeof msg === 'string' ? msg : (msg && msg.message) || 'FK error')
        }
      }
    }
  }
})
jest.mock('../../../../app/inbound/dax/save-dax')
jest.mock('../../../../app/inbound/dax/schema')
jest.mock('../../../../app/inbound/dax/validate-dax')
jest.mock('../../../../app/inbound/dax/get-dax-by-calculation-id-and-payment-reference')

describe('processDax', () => {
  let transaction

  beforeEach(() => {
    jest.clearAllMocks()
    transaction = { commit: jest.fn(), rollback: jest.fn() }
    db.sequelize.transaction.mockResolvedValue(transaction)
  })

  afterEach(() => {
    if (console.info && console.info.mockRestore) console.info.mockRestore()
    if (console.warn && console.warn.mockRestore) console.warn.mockRestore()
    if (console.error && console.error.mockRestore) console.error.mockRestore()
  })

  test('should rollback transaction and log info when dax with same paymentReference exists', async () => {
    const dax = { calculationReference: 1, paymentReference: '123' }
    getDaxByCalculationIdAndPaymentReference.mockResolvedValue({
      ...dax,
      calculationId: dax.calculationReference
    })
    console.info = jest.fn()

    await processDax(dax)

    expect(console.info).toHaveBeenCalledWith(`Duplicate Dax record received, skipping payment reference ${dax.paymentReference} for calculation ${dax.calculationReference}`)
    expect(transaction.rollback).toHaveBeenCalled()
  })

  test('should validate, save and commit transaction when dax with same paymentReference does not exist', async () => {
    const dax = { paymentReference: '123' }
    getDaxByCalculationIdAndPaymentReference.mockResolvedValue(null)
    validateDax.mockImplementation(() => { })
    saveDax.mockResolvedValue()

    await processDax(dax)

    expect(validateDax).toHaveBeenCalledWith(dax, dax.paymentReference)
    expect(saveDax).toHaveBeenCalledWith(dax, transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should retry on ForeignKeyConstraintError and succeed on later attempt', async () => {
    const dax = { calculationReference: 'retry123', paymentReference: '123' }
    getDaxByCalculationIdAndPaymentReference.mockResolvedValue(null)
    validateDax.mockImplementation(() => { })
    const fkError = new db.Sequelize.ForeignKeyConstraintError('FK error')
    saveDax
      .mockRejectedValueOnce(fkError)
      .mockRejectedValueOnce(fkError)
      .mockRejectedValueOnce(fkError)
      .mockResolvedValueOnce()
    console.warn = jest.fn()

    await processDax(dax)

    expect(saveDax).toHaveBeenCalledTimes(4)
    expect(transaction.rollback).toHaveBeenCalledTimes(3)
    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('FK error for Dax'))
  })

  test('should rollback transaction when an error occurs', async () => {
    const dax = { paymentReference: '123' }
    getDaxByCalculationIdAndPaymentReference.mockRejectedValue(new Error('Test error'))

    await expect(processDax(dax)).rejects.toThrow('Test error')
    expect(transaction.rollback).toHaveBeenCalled()
  })
})

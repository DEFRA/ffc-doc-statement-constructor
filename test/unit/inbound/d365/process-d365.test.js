const db = require('../../../../app/data')
const processD365 = require('../../../../app/inbound/d365/process-d365')
const saveD365 = require('../../../../app/inbound/d365/save-d365')
const validateD365 = require('../../../../app/inbound/d365/validate-d365')
const getD365ByPaymentReference = require('../../../../app/inbound/d365/get-d365-by-payment-reference')
const retryUtil = require('../../../../app/utility/retry-fk-error')
const { D365 } = require('../../../../app/constants/types')

beforeAll(() => {
  jest.spyOn(retryUtil, 'sleep').mockImplementation(() => Promise.resolve())
})
afterAll(() => {
  retryUtil.sleep.mockRestore()
})

jest.mock('../../../../app/data', () => {
  return {
    sequelize: { transaction: jest.fn() },
    Sequelize: {
      ForeignKeyConstraintError: class extends Error {
        constructor (msg) {
          super(typeof msg === 'string' ? msg : (msg && msg.message) || 'FK error')
        }
      }
    }
  }
})
jest.mock('../../../../app/inbound/d365/save-d365')
jest.mock('../../../../app/inbound/d365/schema')
jest.mock('../../../../app/inbound/d365/validate-d365')
jest.mock('../../../../app/inbound/d365/get-d365-by-payment-reference')

describe('processD365', () => {
  let transaction

  beforeEach(() => {
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn()
    }
    db.sequelize.transaction.mockResolvedValue(transaction)
    jest.clearAllMocks()
  })

  test('should skip processing and log info when duplicate paymentReference exists', async () => {
    const d365 = { paymentReference: '123' }
    getD365ByPaymentReference.mockResolvedValue(d365)
    console.info = jest.fn()

    await processD365(d365)

    expect(console.info).toHaveBeenCalledWith('Duplicate D365 paymentReference received, skipping 123')
    expect(db.sequelize.transaction).not.toHaveBeenCalled()
  })

  test('should validate, save and commit transaction when new paymentReference is received', async () => {
    const d365 = {
      paymentReference: '123',
      calculationReference: 'abc',
      paymentPeriod: '2024-Q1',
      paymentAmount: 1000,
      transactionDate: '2024-04-01'
    }
    getD365ByPaymentReference.mockResolvedValue(null)
    validateD365.mockImplementation(() => { })
    saveD365.mockResolvedValue()

    await processD365(d365)

    const expectedTransformed = {
      paymentReference: '123',
      calculationId: 'abc',
      paymentPeriod: '2024-Q1',
      paymentAmount: 1000,
      transactionDate: '2024-04-01',
      type: D365
    }

    expect(validateD365).toHaveBeenCalledWith(expectedTransformed, '123')
    expect(saveD365).toHaveBeenCalledWith(expectedTransformed, transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should rollback transaction and rethrow on internal error', async () => {
    const d365 = {
      paymentReference: '123',
      calculationReference: 'abc',
      paymentPeriod: '2024-Q1',
      paymentAmount: 1000
    }
    getD365ByPaymentReference.mockResolvedValue(null)
    validateD365.mockImplementation(() => { })
    saveD365.mockRejectedValue(new Error('Test save error'))

    await expect(processD365(d365)).rejects.toThrow('Test save error')
    expect(transaction.rollback).toHaveBeenCalled()
  })

  test('should rollback and throw validation error when validateD365 fails', async () => {
    const d365 = {
      paymentReference: '123',
      calculationReference: 'abc'
    }
    const validationError = new Error('Validation failed')
    getD365ByPaymentReference.mockResolvedValue(null)
    validateD365.mockImplementation(() => { throw validationError })

    await expect(processD365(d365)).rejects.toThrow('Validation failed')
    expect(db.sequelize.transaction).not.toHaveBeenCalled()
  })

  test('should throw and log when getD365ByPaymentReference fails', async () => {
    const d365 = { paymentReference: '123' }
    const error = new Error()
    getD365ByPaymentReference.mockRejectedValue(error)

    await expect(processD365(d365)).rejects.toThrow('Validation failed')
    expect(transaction.rollback).not.toHaveBeenCalled()
  })

  test('should retry on ForeignKeyConstraintError and succeed on later attempt', async () => {
    const d365 = {
      paymentReference: 'retry123',
      calculationReference: 'abc',
      paymentPeriod: '2024-Q1',
      paymentAmount: 1000,
      transactionDate: '2024-04-01'
    }
    getD365ByPaymentReference.mockResolvedValue(null)
    validateD365.mockImplementation(() => { })
    const fkError = new db.Sequelize.ForeignKeyConstraintError({ message: 'FK error' })
    saveD365
      .mockRejectedValueOnce(fkError)
      .mockRejectedValueOnce(fkError)
      .mockRejectedValueOnce(fkError)
      .mockResolvedValueOnce()
    console.warn = jest.fn()

    await processD365(d365)

    expect(saveD365).toHaveBeenCalledTimes(4)
    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(transaction.rollback).toHaveBeenCalledTimes(3)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('FK error for D365 retry123'))
  })
})

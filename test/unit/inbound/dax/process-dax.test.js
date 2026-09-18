process.env.RETRY_FK_MAX_RETRIES = '4'
process.env.RETRY_FK_BASE_DELAY_MS = '10'
process.env.RETRY_FK_MAX_TOTAL_DELAY_MS = '1000'

const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock()

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close
}))

jest.mock('ffc-alerting-utils')
jest.mock('../../../../app/inbound/dax/save-dax')
jest.mock('../../../../app/inbound/dax/schema')
jest.mock('../../../../app/inbound/dax/validate-dax')
jest.mock('../../../../app/inbound/dax/get-dax-by-calculation-id-and-payment-reference')

const { dataProcessingAlert } = require('ffc-alerting-utils')
const retryUtil = require('../../../../app/utility/retry-fk-error')
const processDax = require('../../../../app/inbound/dax/process-dax')
const saveDax = require('../../../../app/inbound/dax/save-dax')
const validateDax = require('../../../../app/inbound/dax/validate-dax')
const getDaxByCalculationIdAndPaymentReference = require('../../../../app/inbound/dax/get-dax-by-calculation-id-and-payment-reference')
const { DUPLICATE_RECORD } = require('../../../../app/constants/alerts')

const fkError = () => Object.assign(new Error('FK error'), { code: retryUtil.FOREIGN_KEY_VIOLATION })

beforeAll(() => {
  jest.spyOn(retryUtil, 'sleep').mockImplementation(() => Promise.resolve())
})

afterAll(() => {
  retryUtil.sleep.mockRestore()
})

describe('processDax', () => {
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    if (console.info && console.info.mockRestore) {
      console.info.mockRestore()
    }

    if (console.warn && console.warn.mockRestore) {
      console.warn.mockRestore()
    }
  })

  test('should skip processing and rollback when duplicate Dax exists', async () => {
    const dax = { calculationReference: 1, paymentReference: '123' }
    getDaxByCalculationIdAndPaymentReference.mockResolvedValue({ ...dax, calculationId: dax.calculationReference })
    console.info = jest.fn()

    await processDax(dax)

    expect(getDaxByCalculationIdAndPaymentReference).toHaveBeenCalledWith(dax, transaction)
    expect(console.info).toHaveBeenCalledWith(
      `Duplicate Dax record received, skipping payment reference ${dax.paymentReference} for calculation ${dax.calculationReference}`
    )
    expect(transaction.rollback).toHaveBeenCalled()
  })

  test('should trigger alert for duplicate Dax', async () => {
    const dax = { calculationReference: 12345, paymentReference: 'PY1000001' }
    getDaxByCalculationIdAndPaymentReference.mockResolvedValue({ ...dax, calculationId: dax.calculationReference })

    await processDax(dax)

    expect(dataProcessingAlert).toHaveBeenCalledWith(
      {
        process: 'processDax',
        ...dax,
        message: 'A duplicate record was received for payment reference PY1000001 and calculation 12345',
        type: DUPLICATE_RECORD
      },
      DUPLICATE_RECORD
    )
  })

  test('should validate, save, and commit when new Dax is received', async () => {
    const dax = { paymentReference: '123' }
    getDaxByCalculationIdAndPaymentReference.mockResolvedValue(null)
    validateDax.mockImplementation(() => {})
    saveDax.mockResolvedValue()

    await processDax(dax)

    expect(validateDax).toHaveBeenCalledWith(dax, dax.paymentReference)
    expect(saveDax).toHaveBeenCalledWith(dax, transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should retry on a foreign key violation and succeed', async () => {
    const dax = { calculationReference: 'retry123', paymentReference: '123' }
    getDaxByCalculationIdAndPaymentReference.mockResolvedValue(null)
    validateDax.mockImplementation(() => {})
    saveDax
      .mockRejectedValueOnce(fkError())
      .mockRejectedValueOnce(fkError())
      .mockRejectedValueOnce(fkError())
      .mockResolvedValueOnce()
    console.warn = jest.fn()

    await processDax(dax)

    expect(saveDax).toHaveBeenCalledTimes(4)
    expect(transaction.rollback).toHaveBeenCalledTimes(3)
    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('FK error for Dax'))
  })

  test('should rollback transaction on general error', async () => {
    const dax = { paymentReference: '123' }
    getDaxByCalculationIdAndPaymentReference.mockRejectedValue(new Error('Test error'))

    await expect(processDax(dax)).rejects.toThrow('Test error')
    expect(transaction.rollback).toHaveBeenCalled()
  })
})

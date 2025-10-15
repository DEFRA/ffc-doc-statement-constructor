process.env.RETRY_FK_MAX_RETRIES = '4'
process.env.RETRY_FK_BASE_DELAY_MS = '10'
process.env.RETRY_FK_MAX_TOTAL_DELAY_MS = '1000'
const db = require('../../../../app/data')
const processTotal = require('../../../../app/inbound/total/process-total')
const getTotalByCalculationId = require('../../../../app/inbound/total/get-total-by-calculation-id')
const savePlaceholderOrganisation = require('../../../../app/inbound/total/save-placeholder-organisation')
const saveTotal = require('../../../../app/inbound/total/save-total')
const saveActions = require('../../../../app/inbound/total/save-actions')
const validateTotal = require('../../../../app/inbound/total/validate-total')
const retryUtil = require('../../../../app/utility/retry-fk-error')

beforeAll(() => {
  jest.spyOn(retryUtil, 'sleep').mockImplementation(() => Promise.resolve())
})
afterAll(() => {
  retryUtil.sleep.mockRestore()
})

jest.mock('ffc-alerting-utils')
const { dataProcessingAlert } = require('ffc-alerting-utils')
const { DUPLICATE_RECORD } = require('../../../../app/constants/alerts')
const { TOTAL } = require('../../../../app/constants/types')

jest.mock('../../../../app/data', () => {
  return {
    sequelize: {
      transaction: jest.fn()
    },
    total: {
      findOne: jest.fn()
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
jest.mock('../../../../app/inbound/total/get-total-by-calculation-id')
jest.mock('../../../../app/inbound/total/save-placeholder-organisation')
jest.mock('../../../../app/inbound/total/save-total')
jest.mock('../../../../app/inbound/total/save-actions')
jest.mock('../../../../app/inbound/total/validate-total')

describe('processTotal', () => {
  let transaction
  beforeEach(() => {
    transaction = { commit: jest.fn(), rollback: jest.fn() }
    db.sequelize.transaction.mockResolvedValue(transaction)
  })

  test('should rollback transaction and log info when total with same calculationReference exists', async () => {
    const total = { calculationReference: 1, sbi: '123', actions: [] }
    getTotalByCalculationId.mockResolvedValue({
      ...total,
      calculationId: total.calculationReference
    })
    console.info = jest.fn()

    await processTotal(total)

    expect(console.info).toHaveBeenCalledWith(`Duplicate calculationId received, skipping ${total.calculationReference}`)
    expect(transaction.rollback).toHaveBeenCalled()
  })

  test('should trigger alert if duplicate calc ID identified', async () => {
    const total = { calculationReference: 1, sbi: '123', actions: [] }
    getTotalByCalculationId.mockResolvedValue({
      ...total,
      calculationId: total.calculationReference
    })

    await processTotal(total)

    expect(dataProcessingAlert).toHaveBeenCalledWith({
      process: 'processTotal',
      ...total,
      message: `A duplicate record was received for calculation ID ${total.calculationReference}`
    }, DUPLICATE_RECORD)
  })

  test('should validate, save, and commit transaction when calculationReference does not exist', async () => {
    const total = { calculationReference: '123', sbi: '456', actions: [] }
    getTotalByCalculationId.mockResolvedValue(null)
    validateTotal.mockImplementation(() => { })
    savePlaceholderOrganisation.mockResolvedValue()
    saveTotal.mockResolvedValue()
    saveActions.mockResolvedValue()

    await processTotal(total)

    expect(validateTotal).toHaveBeenCalledWith(total, total.calculationReference)
    expect(savePlaceholderOrganisation).toHaveBeenCalledWith({ sbi: total.sbi }, total.sbi)
    expect(saveTotal).toHaveBeenCalledWith(total, transaction)
    expect(saveActions).toHaveBeenCalledWith(total.actions, transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should retry on ForeignKeyConstraintError and succeed on later attempt', async () => {
    const total = { calculationReference: 'retry123', sbi: '456', actions: [] }
    getTotalByCalculationId.mockResolvedValue(null)
    validateTotal.mockImplementation(() => { })
    savePlaceholderOrganisation.mockResolvedValue()
    const fkError = new (require('../../../../app/data').Sequelize.ForeignKeyConstraintError)('FK error')
    saveTotal
      .mockRejectedValueOnce(fkError)
      .mockRejectedValueOnce(fkError)
      .mockRejectedValueOnce(fkError)
      .mockResolvedValueOnce()
    saveActions.mockResolvedValue()
    console.warn = jest.fn()

    await processTotal(total)

    expect(saveTotal).toHaveBeenCalledTimes(5)
    expect(transaction.rollback).toHaveBeenCalledTimes(3)
    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('FK error for total'))
  })

  test('should rollback transaction when an error occurs', async () => {
    const total = { calculationReference: 'err', sbi: '456', actions: [] }
    getTotalByCalculationId.mockRejectedValue(new Error('Test error'))

    try {
      await processTotal(total)
    } catch (error) {
      expect(transaction.rollback).toHaveBeenCalled()
      expect(error).toEqual(new Error('Test error'))
    }
  })
})

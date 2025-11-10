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
    jest.clearAllMocks()
  })

  test.each([
    ['duplicate total logs info and rollbacks', (total) => {
      console.info = jest.fn()
      return processTotal(total).then(() => {
        expect(console.info).toHaveBeenCalledWith(
          `Duplicate calculationId received, skipping ${total.calculationReference}`
        )
        expect(transaction.rollback).toHaveBeenCalled()
      })
    }],
    ['duplicate total triggers alert', (total) => {
      return processTotal(total).then(() => {
        expect(dataProcessingAlert).toHaveBeenCalledWith({
          process: 'processTotal',
          ...total,
          message: `A duplicate record was received for calculation ID ${total.calculationReference}`,
          type: DUPLICATE_RECORD
        }, DUPLICATE_RECORD)
      })
    }]
  ])('%s', async (_, fn) => {
    const total = { calculationReference: 1, sbi: '123', actions: [] }
    getTotalByCalculationId.mockResolvedValue({ ...total, calculationId: total.calculationReference })
    await fn(total)
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
    const fkError = new db.Sequelize.ForeignKeyConstraintError('FK error')
    saveTotal
      .mockRejectedValueOnce(fkError)
      .mockRejectedValueOnce(fkError)
      .mockResolvedValueOnce()
    saveActions.mockResolvedValue()
    console.warn = jest.fn()

    await processTotal(total)

    expect(saveTotal).toHaveBeenCalledTimes(3)
    expect(transaction.rollback).toHaveBeenCalledTimes(2)
    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('FK error for total'))
  })

  test('should rollback transaction when an error occurs', async () => {
    const total = { calculationReference: 'err', sbi: '456', actions: [] }
    getTotalByCalculationId.mockRejectedValue(new Error('Test error'))

    await expect(processTotal(total)).rejects.toThrow('Test error')
    expect(transaction.rollback).toHaveBeenCalled()
  })
})

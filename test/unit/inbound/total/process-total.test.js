process.env.RETRY_FK_MAX_RETRIES = '4'
process.env.RETRY_FK_BASE_DELAY_MS = '10'
process.env.RETRY_FK_MAX_TOTAL_DELAY_MS = '1000'

const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock()

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close
}))

jest.mock('ffc-alerting-utils')
jest.mock('../../../../app/inbound/total/get-total-by-calculation-id')
jest.mock('../../../../app/inbound/total/save-placeholder-organisation')
jest.mock('../../../../app/inbound/total/save-total')
jest.mock('../../../../app/inbound/total/save-actions')
jest.mock('../../../../app/inbound/total/validate-total')

const { dataProcessingAlert } = require('ffc-alerting-utils')
const retryUtil = require('../../../../app/utility/retry-fk-error')
const processTotal = require('../../../../app/inbound/total/process-total')
const getTotalByCalculationId = require('../../../../app/inbound/total/get-total-by-calculation-id')
const savePlaceholderOrganisation = require('../../../../app/inbound/total/save-placeholder-organisation')
const saveTotal = require('../../../../app/inbound/total/save-total')
const saveActions = require('../../../../app/inbound/total/save-actions')
const validateTotal = require('../../../../app/inbound/total/validate-total')
const { DUPLICATE_RECORD } = require('../../../../app/constants/alerts')

const fkError = () => Object.assign(new Error('FK error'), { code: retryUtil.FOREIGN_KEY_VIOLATION })

beforeAll(() => {
  jest.spyOn(retryUtil, 'sleep').mockImplementation(() => Promise.resolve())
})
afterAll(() => {
  retryUtil.sleep.mockRestore()
})

describe('processTotal', () => {
  const transaction = mockDb.trx

  beforeEach(() => {
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

    expect(getTotalByCalculationId).toHaveBeenCalledWith(total.calculationReference, transaction)
    expect(validateTotal).toHaveBeenCalledWith(total, total.calculationReference)
    expect(savePlaceholderOrganisation).toHaveBeenCalledWith({ sbi: total.sbi }, total.sbi, transaction)
    expect(saveTotal).toHaveBeenCalledWith(total, transaction)
    expect(saveActions).toHaveBeenCalledWith(total.actions, transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should retry on a foreign key violation and succeed on later attempt', async () => {
    const total = { calculationReference: 'retry123', sbi: '456', actions: [] }
    getTotalByCalculationId.mockResolvedValue(null)
    validateTotal.mockImplementation(() => { })
    savePlaceholderOrganisation.mockResolvedValue()
    saveTotal
      .mockRejectedValueOnce(fkError())
      .mockRejectedValueOnce(fkError())
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

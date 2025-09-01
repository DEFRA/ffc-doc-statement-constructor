process.env.RETRY_FK_MAX_RETRIES = '4'
const db = require('../../../../app/data')
const processCalculation = require('../../../../app/inbound/calculation/process-calculation')
const saveCalculation = require('../../../../app/inbound/calculation/save-calculation')
const savePlaceholderOrganisation = require('../../../../app/inbound/calculation/save-placeholder-organisation')
const saveFundings = require('../../../../app/inbound/calculation/save-fundings')
const getCalculationByCalculationReference = require('../../../../app/inbound/calculation/get-calculation-by-calculation-reference')
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
jest.mock('../../../../app/inbound/calculation/save-calculation')
jest.mock('../../../../app/inbound/calculation/save-placeholder-organisation')
jest.mock('../../../../app/inbound/calculation/save-fundings')
jest.mock('../../../../app/inbound/calculation/get-calculation-by-calculation-reference')

describe('processCalculation', () => {
  let transaction
  beforeEach(() => {
    transaction = { commit: jest.fn(), rollback: jest.fn() }
    db.sequelize.transaction.mockResolvedValue(transaction)
  })

  test('should rollback transaction and log info when calculation with same calculationReference exists', async () => {
    const calculation = { calculationReference: 1, sbi: '123', fundings: [] }
    getCalculationByCalculationReference.mockResolvedValue({
      ...calculation,
      calculationReference: calculation.calculationReference
    })
    console.info = jest.fn()

    await processCalculation(calculation)

    expect(console.info).toHaveBeenCalledWith(`Duplicate calculation received, skipping ${calculation.calculationReference}`)
    expect(transaction.rollback).toHaveBeenCalled()
  })

  test('should save, fund, and commit transaction when calculationReference does not exist', async () => {
    const calculation = { calculationReference: '123', sbi: '456', fundings: [] }
    getCalculationByCalculationReference.mockResolvedValue(null)
    savePlaceholderOrganisation.mockResolvedValue()
    saveCalculation.mockResolvedValue({ ...calculation, calculationId: 1 })
    saveFundings.mockResolvedValue()

    await processCalculation(calculation)

    expect(savePlaceholderOrganisation).toHaveBeenCalledWith({ sbi: calculation.sbi }, calculation.sbi)
    expect(saveCalculation).toHaveBeenCalledWith(calculation, transaction)
    expect(saveFundings).toHaveBeenCalledWith(calculation.fundings, 1, transaction)
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should retry on ForeignKeyConstraintError and succeed on later attempt', async () => {
    const calculation = { calculationReference: 'retry123', sbi: '456', fundings: [] }
    getCalculationByCalculationReference.mockResolvedValue(null)
    savePlaceholderOrganisation.mockResolvedValue()
    const fkError = new db.Sequelize.ForeignKeyConstraintError('FK error')
    saveCalculation
      .mockRejectedValueOnce(fkError)
      .mockRejectedValueOnce(fkError)
      .mockRejectedValueOnce(fkError)
      .mockResolvedValueOnce({ ...calculation, calculationId: 1 })
    saveFundings.mockResolvedValue()
    console.warn = jest.fn()

    await processCalculation(calculation)

    // 4 attempts: 3 failures, 1 success
    expect(saveCalculation).toHaveBeenCalledTimes(5)
    expect(transaction.rollback).toHaveBeenCalledTimes(3)
    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('FK error for calculation'))
  })

  test('should rollback transaction when an error occurs', async () => {
    const calculation = { calculationReference: 'err', sbi: '456', fundings: [] }
    getCalculationByCalculationReference.mockRejectedValue(new Error('Test error'))

    try {
      await processCalculation(calculation)
    } catch (error) {
      expect(transaction.rollback).toHaveBeenCalled()
      expect(error).toEqual(new Error('Test error'))
    }
  })
})

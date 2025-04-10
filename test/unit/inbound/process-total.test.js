const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

const saveActions = require('../../../app/inbound/total/save-actions')
const processTotal = require('../../../app/inbound/total')
const mockTotal = require('../../mock-objects/mock-total')

jest.mock('../../../app/data', () => {
  return {
    sequelize: {
      transaction: jest.fn().mockImplementation(() => {
        return { ...mockTransaction }
      })
    },
    total: {
      findOne: jest.fn()
    }
  }
})

jest.mock('../../../app/inbound/total/get-total-by-calculation-id')
const getTotalByCalculationId = require('../../../app/inbound/total/get-total-by-calculation-id')

jest.mock('../../../app/inbound/total/save-total')
const saveTotal = require('../../../app/inbound/total/save-total')

jest.mock('../../../app/inbound/total/save-placeholder-organisation')
const savePlaceholderOrganisation = require('../../../app/inbound/total/save-placeholder-organisation')

jest.mock('../../../app/inbound/total/save-actions')

let total

describe('process total', () => {
  beforeEach(() => {
    total = JSON.parse(JSON.stringify(require('../../mock-objects/mock-total')))

    getTotalByCalculationId.mockResolvedValue(null)
    savePlaceholderOrganisation.mockResolvedValue(undefined)
    saveActions.mockResolvedValue(undefined)
    saveTotal.mockResolvedValue({ ...total, calculationId: 1 })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getTotalByCalculationId when a valid total is given and a previous total does not exist', async () => {
    await processTotal(mockTotal)
    expect(getTotalByCalculationId).toHaveBeenCalled()
  })

  test('should call getTotalByCalculationId once when a valid total is given and a previous total does not exist', async () => {
    await processTotal(mockTotal)
    expect(getTotalByCalculationId).toHaveBeenCalledTimes(1)
  })

  test('should call getTotalByCalculationId with mockTotal.calculationReference and mockTransaction when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(getTotalByCalculationId).toHaveBeenCalledWith(mockTotal.calculationReference)
  })

  test('should call savePlaceholderOrganisation when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(savePlaceholderOrganisation).toHaveBeenCalled()
  })

  test('should call savePlaceholderOrganisation once when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(savePlaceholderOrganisation).toHaveBeenCalledTimes(1)
  })

  test('should call savePlaceholderOrganisation with { sbi: total.sbi }, total.sbi and transaction when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(savePlaceholderOrganisation).toHaveBeenCalledWith(
      { sbi: mockTotal.sbi },
      mockTotal.sbi,
      expect.any(Object)
    )
  })

  test('should call saveTotal when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(saveTotal).toHaveBeenCalled()
  })

  test('should call saveTotal once when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(saveTotal).toHaveBeenCalledTimes(1)
  })

  test('should call saveTotal with calculation and mockTransaction when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(saveTotal).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockTotal,
        agreementEnd: expect.any(Date),
        agreementStart: expect.any(Date),
        calculationDate: expect.any(Date),
        updated: expect.any(Date)
      }),
      expect.anything()
    )
  })

  test('should call saveActions when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(saveActions).toHaveBeenCalled()
  })

  test('should call saveActions once when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(saveActions).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.commit when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should not call mockTransaction.rollback when the truthy tests pass and nothing throws', async () => {
    await processTotal(mockTotal)
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should log and return early when duplicate calculationId is found', async () => {
    const mockExistingTotal = { calculationId: mockTotal.calculationReference }
    getTotalByCalculationId.mockResolvedValue(mockExistingTotal)

    const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

    const result = await processTotal(mockTotal)

    expect(consoleSpy).toHaveBeenCalledWith(
      `Duplicate calculationId received, skipping ${mockExistingTotal.calculationId}`
    )

    expect(result).toBeUndefined()

    consoleSpy.mockRestore()
  })

  test('should call mockTransaction.rollback once when saveActions throws', async () => {
    saveActions.mockRejectedValue(new Error('Database save down issue'))
    try { await processTotal(mockTotal) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when saveTotal throws', async () => {
    saveTotal.mockRejectedValue(new Error('Database save down issue'))
    try { await processTotal(mockTotal) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when saveTotal throws', async () => {
    saveTotal.mockRejectedValue(new Error('Database save down issue'))
    try { await processTotal(mockTotal) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processTotal(mockTotal) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processTotal(mockTotal) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })
})

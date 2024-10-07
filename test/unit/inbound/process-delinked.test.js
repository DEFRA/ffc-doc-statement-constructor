const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

const processDelinked = require('../../../app/inbound/delinked/process-delinked')
const { mockDelinked1 } = require('../../mock-objects/mock-delinked')

jest.mock('../../../app/data', () => {
  return {
    sequelize: {
      transaction: jest.fn().mockImplementation(() => {
        return { ...mockTransaction }
      })
    }
  }
})

jest.mock('../../../app/inbound/delinked/get-delinked-by-calculation-id')
const getDelinkedByCalculationId = require('../../../app/inbound/delinked/get-delinked-by-calculation-id')

jest.mock('../../../app/inbound/delinked/save-placeholder-organisation')
const savePlaceholderOrganisation = require('../../../app/inbound/delinked/save-placeholder-organisation')

jest.mock('../../../app/inbound/delinked/save-delinked')
const saveDelinked = require('../../../app/inbound/delinked/save-delinked')

describe('processDelinked', () => {
  beforeEach(() => {
    getDelinkedByCalculationId.mockResolvedValue(null)
    savePlaceholderOrganisation.mockResolvedValue(undefined)
    saveDelinked.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getDelinkedByCalculationId when a valid delinked is given and a previous delinked does not exist', async () => {
    await processDelinked(mockDelinked1)
    expect(getDelinkedByCalculationId).toHaveBeenCalled()
  })

  test('should call getDelinkedByCalculationId once when a valid delinked is given and a previous delinked does not exist', async () => {
    await processDelinked(mockDelinked1)
    expect(getDelinkedByCalculationId).toHaveBeenCalledTimes(1)
  })

  test('should call getDelinkedByCalculationId with mockTransaction', async () => {
    await processDelinked(mockDelinked1)
    expect(getDelinkedByCalculationId).toHaveBeenCalledWith(mockDelinked1.calculationId, mockTransaction)
  })

  test('should call savePlaceholderOrganisation when no previous delinked exists', async () => {
    await processDelinked(mockDelinked1)
    expect(savePlaceholderOrganisation).toHaveBeenCalled()
  })

  test('should call savePlaceholderOrganisation once when no previous delinked exists', async () => {
    await processDelinked(mockDelinked1)
    expect(savePlaceholderOrganisation).toHaveBeenCalledTimes(1)
  })

  test('should call savePlaceholderOrganisation with { sbi: delinked.sbi } and delinked.sbi', async () => {
    await processDelinked(mockDelinked1)
    expect(savePlaceholderOrganisation).toHaveBeenCalledWith({ sbi: mockDelinked1.sbi }, mockDelinked1.sbi)
  })

  test('should call saveDelinked when no previous delinked exists', async () => {
    await processDelinked(mockDelinked1)
    expect(saveDelinked).toHaveBeenCalled()
  })

  test('should call saveDelinked once when no previous delinked exists', async () => {
    await processDelinked(mockDelinked1)
    expect(saveDelinked).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.commit when no previous delinked exists', async () => {
    await processDelinked(mockDelinked1)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when no previous delinked exists', async () => {
    await processDelinked(mockDelinked1)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should not call mockTransaction.rollback when no previous delinked exists and nothing throws', async () => {
    await processDelinked(mockDelinked1)
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should call getDelinkedByCalculationId when a previous delinked exists', async () => {
    getDelinkedByCalculationId.mockResolvedValue(mockDelinked1)
    await processDelinked(mockDelinked1)
    expect(getDelinkedByCalculationId).toHaveBeenCalled()
  })

  test('should call getDelinkedByCalculationId once when a previous delinked exists', async () => {
    getDelinkedByCalculationId.mockResolvedValue(mockDelinked1)
    await processDelinked(mockDelinked1)
    expect(getDelinkedByCalculationId).toHaveBeenCalledTimes(1)
  })

  test('should call getDelinkedByCalculationId with mockDelinked.calculationReference and mockTransaction when a previous delinked exists', async () => {
    getDelinkedByCalculationId.mockResolvedValue(mockDelinked1)
    await processDelinked(mockDelinked1)
    expect(getDelinkedByCalculationId).toHaveBeenCalledWith(mockDelinked1.calculationReference, mockTransaction)
  })

  test('should call mockTransaction.rollback when a previous delinked exists', async () => {
    getDelinkedByCalculationId.mockResolvedValue(mockDelinked1)
    await processDelinked(mockDelinked1)
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when a previous delinked exists', async () => {
    getDelinkedByCalculationId.mockResolvedValue(mockDelinked1)
    await processDelinked(mockDelinked1)
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should not call savePlaceholderOrganisation when a previous delinked exists', async () => {
    getDelinkedByCalculationId.mockResolvedValue(mockDelinked1)
    await processDelinked(mockDelinked1)
    expect(savePlaceholderOrganisation).not.toHaveBeenCalled()
  })

  test('should not call saveDelinked when a previous delinked exists', async () => {
    getDelinkedByCalculationId.mockResolvedValue(mockDelinked1)
    await processDelinked(mockDelinked1)
    expect(saveDelinked).not.toHaveBeenCalled()
  })

  test('should throw when getDelinkedByCalculationId throws', async () => {
    getDelinkedByCalculationId.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processDelinked(mockDelinked1)
    }

    expect(wrapper).rejects.toThrow()
  })
})

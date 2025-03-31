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

const db = require('../../../app/data')

jest.mock('../../../app/inbound/delinked/get-delinked-by-calculation-id')
const getDelinkedByCalculationId = require('../../../app/inbound/delinked/get-delinked-by-calculation-id')

jest.mock('../../../app/inbound/delinked/save-placeholder-organisation')
const savePlaceholderOrganisation = require('../../../app/inbound/delinked/save-placeholder-organisation')

jest.mock('../../../app/inbound/delinked/save-delinked')
const saveDelinked = require('../../../app/inbound/delinked/save-delinked')

jest.mock('../../../app/inbound/delinked/validate-delinked')
const validateDelinked = require('../../../app/inbound/delinked/validate-delinked')

describe('processDelinked', () => {
  beforeEach(() => {
    getDelinkedByCalculationId.mockResolvedValue(null)
    savePlaceholderOrganisation.mockResolvedValue(undefined)
    saveDelinked.mockResolvedValue(undefined)
    validateDelinked.mockResolvedValue(undefined)
    jest.clearAllMocks()
  })

  test('should transform delinked data correctly', async () => {
    const delinked = {
      calculationReference: 'calc123',
      applicationReference: 'app123',
      sbi: '123456789'
    }

    await processDelinked(delinked)

    expect(validateDelinked).toHaveBeenCalledWith(
      expect.objectContaining({
        calculationId: 'calc123',
        applicationId: 'app123',
        sbi: '123456789'
      }),
      'calc123'
    )
  })

  test('should validate transformed delinked data', async () => {
    await processDelinked(mockDelinked1)
    expect(validateDelinked).toHaveBeenCalledWith(
      expect.objectContaining({ calculationId: mockDelinked1.calculationReference }),
      mockDelinked1.calculationReference
    )
  })

  test('should check for existing delinked record without a transaction', async () => {
    await processDelinked(mockDelinked1)
    expect(getDelinkedByCalculationId).toHaveBeenCalledWith(mockDelinked1.calculationReference)
    expect(getDelinkedByCalculationId).not.toHaveBeenCalledWith(
      mockDelinked1.calculationReference,
      expect.anything()
    )
  })

  test('should log info and not proceed when delinked already exists', async () => {
    getDelinkedByCalculationId.mockResolvedValue(mockDelinked1)
    console.info = jest.fn()

    await processDelinked(mockDelinked1)

    expect(console.info).toHaveBeenCalledWith(
      `Duplicate delinked received, skipping ${mockDelinked1.calculationReference}`
    )
    expect(savePlaceholderOrganisation).not.toHaveBeenCalled()
    expect(db.sequelize.transaction).not.toHaveBeenCalled()
  })

  test('should save placeholder organisation before creating transaction', async () => {
    // Create spy to track call order
    const callOrder = []
    savePlaceholderOrganisation.mockImplementation(() => {
      callOrder.push('savePlaceholderOrganisation')
      return Promise.resolve()
    })

    db.sequelize.transaction.mockImplementation(() => {
      callOrder.push('transaction')
      return mockTransaction
    })

    await processDelinked(mockDelinked1)

    expect(savePlaceholderOrganisation).toHaveBeenCalledWith(
      { sbi: mockDelinked1.sbi },
      mockDelinked1.sbi
    )
    expect(callOrder[0]).toBe('savePlaceholderOrganisation')
    expect(callOrder[1]).toBe('transaction')
  })

  test('should handle error when saving placeholder organisation fails', async () => {
    const error = new Error('Placeholder org save error')
    savePlaceholderOrganisation.mockRejectedValue(error)
    console.error = jest.fn()

    await expect(processDelinked(mockDelinked1)).rejects.toThrow(error)
    expect(console.error).toHaveBeenCalled()
    expect(db.sequelize.transaction).not.toHaveBeenCalled()
  })

  test('should save delinked data and commit transaction when successful', async () => {
    await processDelinked(mockDelinked1)

    expect(saveDelinked).toHaveBeenCalledWith(
      expect.objectContaining({ calculationId: mockDelinked1.calculationReference }),
      mockTransaction
    )
    expect(mockTransaction.commit).toHaveBeenCalled()
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should rollback transaction when saving delinked data fails', async () => {
    const error = new Error('Save delinked error')
    saveDelinked.mockRejectedValue(error)

    await expect(processDelinked(mockDelinked1)).rejects.toThrow(error)
    expect(mockTransaction.rollback).toHaveBeenCalled()
    expect(mockTransaction.commit).not.toHaveBeenCalled()
  })

  test('should throw when validation fails', async () => {
    const error = new Error('Validation error')
    validateDelinked.mockRejectedValue(error)

    await expect(processDelinked(mockDelinked1)).rejects.toThrow(error)
    expect(getDelinkedByCalculationId).not.toHaveBeenCalled()
    expect(savePlaceholderOrganisation).not.toHaveBeenCalled()
    expect(db.sequelize.transaction).not.toHaveBeenCalled()
  })
})

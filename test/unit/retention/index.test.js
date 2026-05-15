const { removeAgreementData } = require('../../../app/retention')
const db = require('../../../app/data')
const { DELINKED } = require('../../../app/constants/scheme-ids')

jest.mock('../../../app/data', () => ({
  sequelize: {
    transaction: jest.fn()
  }
}))

jest.mock('../../../app/retention/find-delinked-calculations', () => ({
  findDelinkedCalculations: jest.fn()
}))

jest.mock('../../../app/retention/remove-d365', () => ({
  removeD365: jest.fn()
}))

jest.mock('../../../app/retention/remove-delinked-calculations', () => ({
  removeDelinkedCalculations: jest.fn()
}))

jest.mock('../../../app/retention/find-d365s', () => ({
  findD365s: jest.fn()
}))

jest.mock('../../../app/retention/remove-documents', () => ({
  removeDocuments: jest.fn()
}))

jest.mock('../../../app/retention/remove-excluded-payment-references', () => ({
  removeExcludedPaymentReferences: jest.fn()
}))

const { findDelinkedCalculations } = require('../../../app/retention/find-delinked-calculations')
const { removeD365 } = require('../../../app/retention/remove-d365')
const { removeDelinkedCalculations } = require('../../../app/retention/remove-delinked-calculations')
const { findD365s } = require('../../../app/retention/find-d365s')
const { removeDocuments } = require('../../../app/retention/remove-documents')
const { removeExcludedPaymentReferences } = require('../../../app/retention/remove-excluded-payment-references')

describe('removeAgreementData', () => {
  const retentionDataDelinked = {
    simplifiedAgreementNumber: 'AGR-001',
    frn: 123456,
    schemeId: DELINKED
  }
  const retentionDataNotDelinked = {
    simplifiedAgreementNumber: 'AGR-002',
    frn: 654321,
    schemeId: 1
  }
  let transaction

  beforeEach(() => {
    jest.clearAllMocks()

    transaction = {
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue()
    }
    db.sequelize.transaction.mockResolvedValue(transaction)
  })

  test('commits and returns early if schemeId is not DELINKED', async () => {
    await removeAgreementData(retentionDataNotDelinked)

    expect(db.sequelize.transaction).toHaveBeenCalledTimes(1)
    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(transaction.rollback).not.toHaveBeenCalled()
    expect(findDelinkedCalculations).not.toHaveBeenCalled()
  })

  test('commits and returns early if no delinked calculations found', async () => {
    findDelinkedCalculations.mockResolvedValue([])

    await removeAgreementData(retentionDataDelinked)

    expect(db.sequelize.transaction).toHaveBeenCalledTimes(1)
    expect(findDelinkedCalculations).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      retentionDataDelinked.frn,
      transaction
    )
    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(transaction.rollback).not.toHaveBeenCalled()
  })

  test('removes documents, excluded payment refs, d365 and delinked calculations when calculations exist', async () => {
    const calculations = [
      { calculationId: 101 },
      { calculationId: 102 }
    ]
    const d365s = [
      { paymentReference: 'PR-1' },
      { paymentReference: 'PR-2' }
    ]
    const calculationIds = calculations.map(c => c.calculationId)
    const paymentReferences = d365s.map(d => d.paymentReference)

    findDelinkedCalculations.mockResolvedValue(calculations)
    findD365s.mockResolvedValue(d365s)

    removeDocuments.mockResolvedValue()
    removeExcludedPaymentReferences.mockResolvedValue()
    removeD365.mockResolvedValue()
    removeDelinkedCalculations.mockResolvedValue()

    await removeAgreementData(retentionDataDelinked)

    expect(db.sequelize.transaction).toHaveBeenCalledTimes(1)

    expect(findDelinkedCalculations).toHaveBeenCalledWith(
      retentionDataDelinked.simplifiedAgreementNumber,
      retentionDataDelinked.frn,
      transaction
    )

    expect(findD365s).toHaveBeenCalledWith(
      calculationIds,
      transaction
    )

    expect(removeDocuments).toHaveBeenCalledWith(
      paymentReferences,
      transaction
    )

    expect(removeExcludedPaymentReferences).toHaveBeenCalledWith(
      paymentReferences,
      transaction
    )

    expect(removeD365).toHaveBeenCalledWith(
      calculationIds,
      transaction
    )

    expect(removeDelinkedCalculations).toHaveBeenCalledWith(
      calculationIds,
      transaction
    )

    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(transaction.rollback).not.toHaveBeenCalled()
  })

  test('rolls back transaction and throws if an error occurs', async () => {
    const calculations = [
      { calculationId: 1 }
    ]
    findDelinkedCalculations.mockResolvedValue(calculations)
    findD365s.mockResolvedValue([])

    const error = new Error('Failure in removeD365')
    removeD365.mockRejectedValue(error)

    removeDocuments.mockResolvedValue()
    removeExcludedPaymentReferences.mockResolvedValue()
    removeDelinkedCalculations.mockResolvedValue()

    await expect(removeAgreementData(retentionDataDelinked)).rejects.toThrow('Failure in removeD365')

    expect(transaction.rollback).toHaveBeenCalledTimes(1)
    expect(transaction.commit).not.toHaveBeenCalled()
  })
})

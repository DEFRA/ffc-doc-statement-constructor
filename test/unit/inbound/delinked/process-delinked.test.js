const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

const processDelinked = require('../../../../app/inbound/delinked/process-delinked')
const { mockDelinked1 } = require('../../../mock-objects/mock-delinked')

jest.mock('ffc-alerting-utils')
const { dataProcessingAlert } = require('ffc-alerting-utils')
const { DUPLICATE_RECORD } = require('../../../../app/constants/alerts')

jest.mock('../../../../app/data', () => {
  return {
    sequelize: {
      transaction: jest.fn().mockImplementation(() => {
        return { ...mockTransaction }
      })
    }
  }
})

jest.mock('../../../../app/inbound/delinked/get-delinked-by-calculation-id')
const getDelinkedByCalculationId = require('../../../../app/inbound/delinked/get-delinked-by-calculation-id')

jest.mock('../../../../app/inbound/delinked/save-placeholder-organisation')
const savePlaceholderOrganisation = require('../../../../app/inbound/delinked/save-placeholder-organisation')

jest.mock('../../../../app/inbound/delinked/save-delinked')
const saveDelinked = require('../../../../app/inbound/delinked/save-delinked')

jest.mock('../../../../app/inbound/delinked/validate-delinked')
const validateDelinked = require('../../../../app/inbound/delinked/validate-delinked')

describe('processDelinked', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getDelinkedByCalculationId.mockResolvedValue(null)
    savePlaceholderOrganisation.mockResolvedValue(undefined)
    saveDelinked.mockResolvedValue(undefined)
    validateDelinked.mockResolvedValue(undefined)
  })

  afterEach(() => {
    if (console.info?.mockRestore) {
      console.info.mockRestore()
    }

    if (console.error?.mockRestore) {
      console.error.mockRestore()
    }
  })

  describe.each([
    ['no previous delinked', null, true],
    ['previous delinked exists', mockDelinked1, false]
  ])('%s', (_desc, existingDelinked, shouldSave) => {
    beforeEach(() => {
      getDelinkedByCalculationId.mockResolvedValue(existingDelinked)
    })

    test('calls getDelinkedByCalculationId with calculationReference', async () => {
      await processDelinked(mockDelinked1)
      expect(getDelinkedByCalculationId).toHaveBeenCalledWith(mockDelinked1.calculationReference)
    })

    test(`${shouldSave ? 'saves delinked and placeholder org' : 'skips saving'}`, async () => {
      console.info = jest.fn()
      await processDelinked(mockDelinked1)

      if (shouldSave) {
        expect(savePlaceholderOrganisation).toHaveBeenCalledWith(
          { sbi: mockDelinked1.sbi },
          mockDelinked1.sbi,
          mockTransaction
        )

        expect(saveDelinked).toHaveBeenCalledWith(
          expect.objectContaining({
            calculationId: mockDelinked1.calculationId || mockDelinked1.calculationReference,
            sbi: mockDelinked1.sbi,
            frn: mockDelinked1.frn,
            datePublished: mockDelinked1.datePublished
          }),
          mockTransaction
        )

        expect(mockTransaction.commit).toHaveBeenCalled()
        expect(mockTransaction.rollback).not.toHaveBeenCalled()
      } else {
        expect(savePlaceholderOrganisation).not.toHaveBeenCalled()
        expect(saveDelinked).not.toHaveBeenCalled()
        expect(console.info).toHaveBeenCalledWith(
          `Duplicate delinked received, skipping ${mockDelinked1.calculationId}`
        )
        expect(dataProcessingAlert).toHaveBeenCalledWith(
          {
            process: 'processDelinked',
            ...mockDelinked1,
            message: `A duplicate record was received for calculation ID ${mockDelinked1.calculationId}`,
            type: DUPLICATE_RECORD
          },
          DUPLICATE_RECORD
        )
      }
    })
  })

  test('rolls back and logs error if saveDelinked throws', async () => {
    const saveError = new Error('Save error')
    saveDelinked.mockRejectedValue(saveError)
    console.error = jest.fn()

    await expect(processDelinked(mockDelinked1)).rejects.toThrow('Save error')

    expect(mockTransaction.rollback).toHaveBeenCalled()
    expect(mockTransaction.commit).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`Transaction error for delinked ${mockDelinked1.calculationReference}:`), expect.any(Error))
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to process delinked ${mockDelinked1.calculationReference || 'unknown'}:`), expect.any(Error))
  })

  test('propagates errors from getDelinkedByCalculationId', async () => {
    getDelinkedByCalculationId.mockRejectedValue(new Error('DB failure'))
    await expect(processDelinked(mockDelinked1)).rejects.toThrow('DB failure')
  })
})

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

  test('prefers calculationReference and calls getDelinkedByCalculationId with it', async () => {
    await processDelinked(mockDelinked1)
    expect(getDelinkedByCalculationId).toHaveBeenCalledWith(mockDelinked1.calculationReference)
  })

  test('falls back to calculationId when calculationReference missing', async () => {
    const input = { ...mockDelinked1 }
    delete input.calculationReference
    input.calculationId = 9999999
    await processDelinked(input)
    expect(getDelinkedByCalculationId).toHaveBeenCalledWith(9999999)
  })

  test('coerces numeric-string calculationReference to number', async () => {
    const input = { ...mockDelinked1, calculationReference: '12345' }
    await processDelinked(input)
    expect(getDelinkedByCalculationId).toHaveBeenCalledWith(12345)
    expect(saveDelinked).toHaveBeenCalledWith(
      expect.objectContaining({ calculationId: 12345 }),
      expect.any(Object)
    )
  })

  describe('duplicate / save paths', () => {
    describe.each([
      ['no previous delinked', null, true],
      ['previous delinked exists', mockDelinked1, false]
    ])('%s', (_desc, existingDelinked, shouldSave) => {
      beforeEach(() => {
        getDelinkedByCalculationId.mockResolvedValue(existingDelinked)
      })

      test(`${shouldSave ? 'saves delinked and placeholder org' : 'skips saving and alerts'}`, async () => {
        console.info = jest.fn()
        await processDelinked(mockDelinked1)

        const expectedId = mockDelinked1.calculationId || mockDelinked1.calculationReference

        if (shouldSave) {
          expect(savePlaceholderOrganisation).toHaveBeenCalledWith(
            { sbi: mockDelinked1.sbi },
            mockDelinked1.sbi,
            expect.objectContaining({ commit: expect.any(Function), rollback: expect.any(Function) })
          )

          expect(saveDelinked).toHaveBeenCalledWith(
            expect.objectContaining({
              calculationId: expectedId,
              sbi: mockDelinked1.sbi,
              frn: mockDelinked1.frn,
              datePublished: mockDelinked1.datePublished
            }),
            expect.objectContaining({ commit: expect.any(Function), rollback: expect.any(Function) })
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
  })

  test('rolls back and logs error if saveDelinked throws', async () => {
    const saveError = new Error('Save error')
    saveDelinked.mockRejectedValue(saveError)
    console.error = jest.fn()

    await expect(processDelinked(mockDelinked1)).rejects.toThrow('Save error')

    const expectedId = mockDelinked1.calculationId || mockDelinked1.calculationReference

    expect(mockTransaction.rollback).toHaveBeenCalled()
    expect(mockTransaction.commit).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`Transaction error for delinked ${expectedId}:`), expect.any(Error))
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to process delinked ${expectedId}:`), expect.any(Error))
  })

  test('throws when both calculationReference and calculationId are missing', async () => {
    const input = { ...mockDelinked1 }
    delete input.calculationReference
    delete input.calculationId

    console.error = jest.fn()

    await expect(processDelinked(input)).rejects.toThrow('Missing calculationReference/calculationId')
    expect(console.error).toHaveBeenCalledWith('Missing calculationReference/calculationId for delinked', input)
  })

  test('propagates errors from getDelinkedByCalculationId', async () => {
    getDelinkedByCalculationId.mockRejectedValue(new Error('DB failure'))
    await expect(processDelinked(mockDelinked1)).rejects.toThrow('DB failure')
  })
})

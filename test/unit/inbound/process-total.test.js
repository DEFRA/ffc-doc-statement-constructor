const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../app/data', () => {
  return {
    sequelize:
      {
        transaction: jest.fn().mockImplementation(() => {
          return { ...mockTransaction }
        })
      }
  }
})

jest.mock('../../../app/inbound/total/get-total-by-calculation-reference')
const getTotalByCalculationReference = require('../../../app/inbound/total/get-total-by-calculation-reference')

jest.mock('../../../app/inbound/total/save-total')
const saveTotal = require('../../../app/inbound/total/save-total')

jest.mock('../../../app/inbound/total/save-placeholder-organisation')
const savePlaceholderOrganisation = require('../../../app/inbound/total/save-placeholder-organisation')

jest.mock('../../../app/inbound/total/save-actions')
const saveActions = require('../../../app/inbound/total/save-actions')

const processTotal = require('../../../app/inbound/total')

const mockTotal = require('../../mock-objects/mock-total')

let total

describe('process total', () => {
  beforeEach(() => {
    total = JSON.parse(JSON.stringify(require('../../mock-objects/mock-total')))

    getTotalByCalculationReference.mockResolvedValue(null)
    savePlaceholderOrganisation.mockResolvedValue(undefined)
    saveActions.mockResolvedValue(undefined)
    saveTotal.mockResolvedValue({ ...total, calculationId: 1 })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getTotalByCalculationReference when a valid total is given and a previous total does not exist', async () => {
    await processTotal(mockTotal)
    expect(getTotalByCalculationReference).toHaveBeenCalled()
  })

  test('should call getTotalByCalculationReference once when a valid total is given and a previous total does not exist', async () => {
    await processTotal(mockTotal)
    expect(getTotalByCalculationReference).toHaveBeenCalledTimes(1)
  })

  test('should call getTotalByCalculationReference with total.calculationReference and mockTransaction when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(getTotalByCalculationReference).toHaveBeenCalledWith(total.calculationReference, mockTransaction)
  })

  test('should call savePlaceholderOrganisation when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(savePlaceholderOrganisation).toHaveBeenCalled()
  })

  test('should call savePlaceholderOrganisation once when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(savePlaceholderOrganisation).toHaveBeenCalledTimes(1)
  })

  test('should call savePlaceholderOrganisation with { sbi: total.sbi} and total.sbi when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(savePlaceholderOrganisation).toHaveBeenCalledWith({ sbi: total.sbi }, total.sbi)
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

  test('should call saveActions with total.actions, saveTotal().calculationReference and mockTransaction when the truthy tests pass', async () => {
    await processTotal(mockTotal)
    expect(saveActions).toHaveBeenCalledWith(total.actions, (await saveTotal()).calculationId, mockTransaction)
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

  test('should call getTotalByCalculationReference when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(mockTotal)
    expect(getTotalByCalculationReference).toHaveBeenCalled()
  })

  test('should call getTotalByCalculationReference once when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(mockTotal)
    expect(getTotalByCalculationReference).toHaveBeenCalledTimes(1)
  })

  test('should call getTotalByCalculationReference with total.calculationReference and mockTransaction when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(mockTotal)
    expect(getTotalByCalculationReference).toHaveBeenCalledWith(total.calculationReference, mockTransaction)
  })

  test('should call mockTransaction.rollback when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(mockTotal)
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(mockTotal)
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should not call savePlaceholderOrganisation when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(mockTotal)
    expect(savePlaceholderOrganisation).not.toHaveBeenCalled()
  })

  test('should not call saveTotal when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(mockTotal)
    expect(saveTotal).not.toHaveBeenCalled()
  })

  test('should not call saveActions when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(mockTotal)
    expect(saveActions).not.toHaveBeenCalled()
  })

  test('should throw when getTotalByCalculationReference throws', async () => {
    getTotalByCalculationReference.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processTotal(mockTotal)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getTotalByCalculationReference throws Error', async () => {
    getTotalByCalculationReference.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processTotal(mockTotal)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getTotalByCalculationReference throws error', async () => {
    getTotalByCalculationReference.mockRejectedValue(new Error('Database retrieval issue'))
    const wrapper = async () => {
      await processTotal(mockTotal)
    }
    await expect(wrapper).rejects.toThrow('Database retrieval issue')
  })
  test('should throw error with "Payment request with calculationId:" when getTotalByCalculationReference throws error', async () => {
    const errorMessage = 'Payment request with calculationId: 12345678901 does not have the required TOTAL data'
    getTotalByCalculationReference.mockRejectedValue(new Error(errorMessage))
    const wrapper = async () => {
      await processTotal(mockTotal)
    }
    await expect(wrapper).rejects.toThrow(errorMessage)
  })
  test('should throw when savePlaceholderOrganisation throws', async () => {
    savePlaceholderOrganisation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(mockTotal)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw error with "Payment request with calculationId:" when savePlaceholderOrganisation throws error with specific message', async () => {
    const errorMessage = 'Payment request with calculationId: 12345678901 does not have the required TOTAL data: "calculationReference" is required. "agreementNumber" must be a number. "claimReference" is required. "invoiceNumber" must be a string. "agreementStart" is required. "agreementEnd" is required. "totalPayment" is required. "actions" is required. "claimId" is not allowed. "calculationId" is not allowed. "totalPayments" is not allowed'
    savePlaceholderOrganisation.mockRejectedValue(new Error(errorMessage))
    const wrapper = async () => {
      await processTotal(mockTotal)
    }
    await expect(wrapper).rejects.toThrow(errorMessage)
  })

  test('should throw when saveTotal throws', async () => {
    saveTotal.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(mockTotal)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveTotal throws Error', async () => {
    saveTotal.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(mockTotal)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Payment request with calculationId:" when saveTotal throws error with specific message', async () => {
    const errorMessage = 'Payment request with calculationId: 12345678901 does not have the required TOTAL data: "calculationReference" is required. "agreementNumber" must be a number. "claimReference" is required. "invoiceNumber" must be a string. "agreementStart" is required. "agreementEnd" is required. "totalPayment" is required. "actions" is required. "claimId" is not allowed. "calculationId" is not allowed. "totalPayments" is not allowed'
    saveTotal.mockRejectedValue(new Error(errorMessage))
    const wrapper = async () => {
      await processTotal(mockTotal)
    }
    await expect(wrapper).rejects.toThrow(errorMessage)
  })

  test('should throw when saveActions throws', async () => {
    saveActions.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(mockTotal)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveActions throws Error', async () => {
    saveActions.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(mockTotal)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Payment request with calculationId:" when saveActions throws error with specific message', async () => {
    const errorMessage = 'Payment request with calculationId: 12345678901 does not have the required TOTAL data: "calculationReference" is required. "agreementNumber" must be a number. "claimReference" is required. "invoiceNumber" must be a string. "agreementStart" is required. "agreementEnd" is required. "totalPayment" is required. "actions" is required. "claimId" is not allowed. "calculationId" is not allowed. "totalPayments" is not allowed'
    saveActions.mockRejectedValue(new Error(errorMessage))
    const wrapper = async () => {
      await processTotal(mockTotal)
    }
    await expect(wrapper).rejects.toThrow(errorMessage)
  })

  test('should throw error with "Payment request with calculationId:" when saveTotal throws error with specific message', async () => {
    const errorMessage = 'Payment request with calculationId: 12345678901 does not have the required TOTAL data: "calculationReference" is required. "agreementNumber" must be a number. "claimReference" is required. "invoiceNumber" must be a string. "agreementStart" is required. "agreementEnd" is required. "totalPayment" is required. "actions" is required. "claimId" is not allowed. "calculationId" is not allowed. "totalPayments" is not allowed'
    saveTotal.mockRejectedValue(new Error(errorMessage))
    const wrapper = async () => {
      await processTotal(mockTotal)
    }
    await expect(wrapper).rejects.toThrow(errorMessage) // expect the exact error message string
  })

  test('should throw Error when mockTransaction.commit throws Error', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processTotal(mockTotal)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should call mockTransaction.rollback when getTotalByCalculationReference throws', async () => {
    getTotalByCalculationReference.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processTotal(mockTotal) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getTotalByCalculationReference throws', async () => {
    getTotalByCalculationReference.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processTotal(mockTotal) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when saveActions throws', async () => {
    saveActions.mockRejectedValue(new Error('Database save down issue'))
    try { await processTotal(mockTotal) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
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

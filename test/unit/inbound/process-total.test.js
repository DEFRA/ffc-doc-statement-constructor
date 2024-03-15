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
    await processTotal(total)
    expect(getTotalByCalculationReference).toHaveBeenCalled()
  })

  test('should call getTotalByCalculationReference once when a valid total is given and a previous total does not exist', async () => {
    await processTotal(total)
    expect(getTotalByCalculationReference).toHaveBeenCalledTimes(1)
  })

  test('should call getTotalByCalculationReference with total.calculationReference and mockTransaction when the truthy tests pass', async () => {
    await processTotal(total)
    expect(getTotalByCalculationReference).toHaveBeenCalledWith(total.calculationReference, mockTransaction)
  })

  test('should call savePlaceholderOrganisation when the truthy tests pass', async () => {
    await processTotal(total)
    expect(savePlaceholderOrganisation).toHaveBeenCalled()
  })

  test('should call savePlaceholderOrganisation once when the truthy tests pass', async () => {
    await processTotal(total)
    expect(savePlaceholderOrganisation).toHaveBeenCalledTimes(1)
  })

  test('should call savePlaceholderOrganisation with { sbi: total.sbi} and total.sbi when the truthy tests pass', async () => {
    await processTotal(total)
    expect(savePlaceholderOrganisation).toHaveBeenCalledWith({ sbi: total.sbi }, total.sbi)
  })

  test('should call saveTotal when the truthy tests pass', async () => {
    await processTotal(total)
    expect(saveTotal).toHaveBeenCalled()
  })

  test('should call saveTotal once when the truthy tests pass', async () => {
    await processTotal(total)
    expect(saveTotal).toHaveBeenCalledTimes(1)
  })

  test('should call saveTotal with calculation and mockTransaction when the truthy tests pass', async () => {
    await processTotal(total)
    expect(saveTotal).toHaveBeenCalledWith(total, mockTransaction)
  })

  test('should call saveActions when the truthy tests pass', async () => {
    await processTotal(total)
    expect(saveActions).toHaveBeenCalled()
  })

  test('should call saveActions once when the truthy tests pass', async () => {
    await processTotal(total)
    expect(saveActions).toHaveBeenCalledTimes(1)
  })

  test('should call saveActions with total.actions, saveTotal().calculationReference and mockTransaction when the truthy tests pass', async () => {
    await processTotal(total)
    expect(saveActions).toHaveBeenCalledWith(total.actions, (await saveTotal()).calculationId, mockTransaction)
  })

  test('should call mockTransaction.commit when the truthy tests pass', async () => {
    await processTotal(total)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when the truthy tests pass', async () => {
    await processTotal(total)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should not call mockTransaction.rollback when the truthy tests pass and nothing throws', async () => {
    await processTotal(total)
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should call getTotalByCalculationReference when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(total)
    expect(getTotalByCalculationReference).toHaveBeenCalled()
  })

  test('should call getTotalByCalculationReference once when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(total)
    expect(getTotalByCalculationReference).toHaveBeenCalledTimes(1)
  })

  test('should call getTotalByCalculationReference with total.calculationReference and mockTransaction when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(total)
    expect(getTotalByCalculationReference).toHaveBeenCalledWith(total.calculationReference, mockTransaction)
  })

  test('should call mockTransaction.rollback when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(total)
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(total)
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should not call savePlaceholderOrganisation when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(total)
    expect(savePlaceholderOrganisation).not.toHaveBeenCalled()
  })

  test('should not call saveTotal when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(total)
    expect(saveTotal).not.toHaveBeenCalled()
  })

  test('should not call saveActions when the truthy tests pass', async () => {
    getTotalByCalculationReference.mockResolvedValue(total)
    await processTotal(total)
    expect(saveActions).not.toHaveBeenCalled()
  })

  test('should throw when getTotalByCalculationReference throws', async () => {
    getTotalByCalculationReference.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getTotalByCalculationReference throws Error', async () => {
    getTotalByCalculationReference.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getTotalByCalculationReference throws error with "Database retrieval issue"', async () => {
    getTotalByCalculationReference.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should throw when savePlaceholderOrganisation throws', async () => {
    savePlaceholderOrganisation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when savePlaceholderOrganisation throws Error', async () => {
    savePlaceholderOrganisation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when savePlaceholderOrganisation throws error with "Database save down issue"', async () => {
    savePlaceholderOrganisation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when saveTotal throws', async () => {
    saveTotal.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveTotal throws Error', async () => {
    saveTotal.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when saveTotal throws error with "Database save down issue"', async () => {
    saveTotal.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when saveActions throws', async () => {
    saveActions.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveActions throws Error', async () => {
    saveActions.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when saveActions throws error with "Database save down issue"', async () => {
    saveActions.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when mockTransaction.commit throws Error', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Sequelize transaction issue" when mockTransaction.commit throws error with "Sequelize transaction commit issue"', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processTotal(total)
    }

    expect(wrapper).rejects.toThrow(/^Sequelize transaction commit issue$/)
  })

  test('should call mockTransaction.rollback when getTotalByCalculationReference throws', async () => {
    getTotalByCalculationReference.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processTotal(total) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getTotalByCalculationReference throws', async () => {
    getTotalByCalculationReference.mockRejectedValue(new Error('Database retrieval issue'))
    try { await processTotal(total) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when saveActions throws', async () => {
    saveActions.mockRejectedValue(new Error('Database save down issue'))
    try { await processTotal(total) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when saveActions throws', async () => {
    saveActions.mockRejectedValue(new Error('Database save down issue'))
    try { await processTotal(total) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when saveTotal throws', async () => {
    saveTotal.mockRejectedValue(new Error('Database save down issue'))
    try { await processTotal(total) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when saveTotal throws', async () => {
    saveTotal.mockRejectedValue(new Error('Database save down issue'))
    try { await processTotal(total) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processTotal(total) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processTotal(total) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })
})

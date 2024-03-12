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

jest.mock('../../../app/inbound/total/save-total')
const saveTotal = require('../../../app/inbound/total/save-total')

const processTotal = require('../../../app/inbound/total')

let total

describe('process total', () => {
  beforeEach(() => {
    total = JSON.parse(JSON.stringify(require('../../mock-objects/mock-total')))
    saveTotal.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call saveTotal when a valid total is given', async () => {
    await processTotal(total)
    expect(saveTotal).toHaveBeenCalled()
  })

  test('should call saveTotal once when a valid total is given', async () => {
    await processTotal(total)
    expect(saveTotal).toHaveBeenCalledTimes(1)
  })

  test('should call saveTotal with total and mockTransaction when a valid total is given', async () => {
    await processTotal(total)
    expect(saveTotal).toHaveBeenCalledWith(total, mockTransaction)
  })

  test('should call mockTransaction.commit when a valid total is given', async () => {
    await processTotal(total)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when a valid total is given', async () => {
    await processTotal(total)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should not call mockTransaction.rollback when a valid total is given and nothing throws', async () => {
    await processTotal(total)
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
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

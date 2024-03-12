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

jest.mock('../../../app/inbound/dax/save-dax')
const saveDax = require('../../../app/inbound/dax/save-dax')

const processDax = require('../../../app/inbound/dax')

let dax

describe('process dax', () => {
  beforeEach(() => {
    dax = JSON.parse(JSON.stringify(require('../../mock-objects/mock-dax')))
    saveDax.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call saveDax when a valid dax is given', async () => {
    await processDax(dax)
    expect(saveDax).toHaveBeenCalled()
  })

  test('should call saveDax once when a valid dax is given', async () => {
    await processDax(dax)
    expect(saveDax).toHaveBeenCalledTimes(1)
  })

  test('should call saveDax with dax and mockTransaction when a valid dax is given', async () => {
    await processDax(dax)
    expect(saveDax).toHaveBeenCalledWith(dax, mockTransaction)
  })

  test('should call mockTransaction.commit when a valid dax is given', async () => {
    await processDax(dax)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when a valid dax is given', async () => {
    await processDax(dax)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should not call mockTransaction.rollback when a valid dax is given and nothing throws', async () => {
    await processDax(dax)
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should throw when saveDax throws', async () => {
    saveDax.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processDax(dax)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveDax throws Error', async () => {
    saveDax.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processDax(dax)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when saveDax throws error with "Database save down issue"', async () => {
    saveDax.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processDax(dax)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processDax(dax)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when mockTransaction.commit throws Error', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processDax(dax)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Sequelize transaction issue" when mockTransaction.commit throws error with "Sequelize transaction commit issue"', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processDax(dax)
    }

    expect(wrapper).rejects.toThrow(/^Sequelize transaction commit issue$/)
  })

  test('should call mockTransaction.rollback when saveDax throws', async () => {
    saveDax.mockRejectedValue(new Error('Database save down issue'))
    try { await processDax(dax) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when saveDax throws', async () => {
    saveDax.mockRejectedValue(new Error('Database save down issue'))
    try { await processDax(dax) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processDax(dax) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processDax(dax) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })
})

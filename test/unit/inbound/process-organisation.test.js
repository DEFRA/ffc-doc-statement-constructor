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

jest.mock('../../../app/inbound/organisation/save-organisation')
const saveOrganisation = require('../../../app/inbound/organisation/save-organisation')

const processOrganisation = require('../../../app/inbound/organisation')

let organisation

describe('process organisation', () => {
  beforeEach(() => {
    organisation = JSON.parse(JSON.stringify(require('../../mock-objects/mock-organisation')))
    saveOrganisation.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call saveOrganisation when a valid organisation is given', async () => {
    await processOrganisation(organisation)
    expect(saveOrganisation).toHaveBeenCalled()
  })

  test('should call saveOrganisation once when a valid organisation is given', async () => {
    await processOrganisation(organisation)
    expect(saveOrganisation).toHaveBeenCalledTimes(1)
  })

  test('should call saveOrganisation with organisation and mockTransaction when a valid organisation is given', async () => {
    await processOrganisation(organisation)
    expect(saveOrganisation).toHaveBeenCalledWith(organisation, mockTransaction)
  })

  test('should call mockTransaction.commit when a valid organisation is given', async () => {
    await processOrganisation(organisation)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once when a valid organisation is given', async () => {
    await processOrganisation(organisation)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should not call mockTransaction.rollback when a valid organisation is given and nothing throws', async () => {
    await processOrganisation(organisation)
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should throw when saveOrganisation throws', async () => {
    saveOrganisation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processOrganisation(organisation)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when saveOrganisation throws Error', async () => {
    saveOrganisation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processOrganisation(organisation)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database save down issue" when saveOrganisation throws error with "Database save down issue"', async () => {
    saveOrganisation.mockRejectedValue(new Error('Database save down issue'))

    const wrapper = async () => {
      await processOrganisation(organisation)
    }

    expect(wrapper).rejects.toThrow(/^Database save down issue$/)
  })

  test('should throw when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processOrganisation(organisation)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when mockTransaction.commit throws Error', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processOrganisation(organisation)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Sequelize transaction issue" when mockTransaction.commit throws error with "Sequelize transaction commit issue"', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))

    const wrapper = async () => {
      await processOrganisation(organisation)
    }

    expect(wrapper).rejects.toThrow(/^Sequelize transaction commit issue$/)
  })

  test('should call mockTransaction.rollback when saveOrganisation throws', async () => {
    saveOrganisation.mockRejectedValue(new Error('Database save down issue'))
    try { await processOrganisation(organisation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when saveOrganisation throws', async () => {
    saveOrganisation.mockRejectedValue(new Error('Database save down issue'))
    try { await processOrganisation(organisation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processOrganisation(organisation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Sequelize transaction commit issue'))
    try { await processOrganisation(organisation) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })
})

const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../../app/data', () => ({
  sequelize: {
    transaction: jest.fn().mockResolvedValue(mockTransaction)
  }
}))

jest.mock('../../../../app/inbound/organisation/save-organisation')
const saveOrganisation = require('../../../../app/inbound/organisation/save-organisation')

const processOrganisation = require('../../../../app/inbound/organisation')

let organisation

describe('processOrganisation', () => {
  beforeEach(() => {
    organisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))
    saveOrganisation.mockResolvedValue(undefined)
    jest.clearAllMocks()
  })

  test('successfully processes a valid organisation', async () => {
    await processOrganisation(organisation)

    expect(saveOrganisation).toHaveBeenCalledWith(organisation, mockTransaction)
    expect(saveOrganisation).toHaveBeenCalledTimes(1)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('rolls back transaction and throws when saveOrganisation fails', async () => {
    const error = new Error('Database save down issue')
    saveOrganisation.mockRejectedValue(error)

    await expect(processOrganisation(organisation)).rejects.toThrow('Database save down issue')
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
    expect(mockTransaction.commit).not.toHaveBeenCalled()
  })

  test('rolls back transaction and throws when commit fails', async () => {
    const commitError = new Error('Sequelize transaction commit issue')
    mockTransaction.commit.mockRejectedValue(commitError)

    await expect(processOrganisation(organisation)).rejects.toThrow('Sequelize transaction commit issue')
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
    expect(saveOrganisation).toHaveBeenCalledWith(organisation, mockTransaction)
  })
})

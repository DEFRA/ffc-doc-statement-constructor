const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = { commit: mockCommit, rollback: mockRollback }

jest.mock('../../../../app/data', () => ({
  sequelize: {
    transaction: jest.fn().mockResolvedValue({ ...mockTransaction })
  }
}))

jest.mock('../../../../app/inbound/organisation/save-organisation')
const saveOrganisation = require('../../../../app/inbound/organisation/save-organisation')

const processOrganisation = require('../../../../app/inbound/organisation')

let organisation

describe('process organisation', () => {
  beforeEach(() => {
    // require the original mock object
    const original = require('../../../mock-objects/mock-organisation')

    // manual shallow clone to preserve Date objects
    organisation = { ...original }

    saveOrganisation.mockResolvedValue(undefined)
    jest.clearAllMocks()
  })

  const run = () => processOrganisation(organisation)

  // ----- Successful processing -----
  test('calls saveOrganisation with organisation and transaction', async () => {
    await run()
    expect(saveOrganisation).toHaveBeenCalledWith(organisation, mockTransaction)
    expect(saveOrganisation).toHaveBeenCalledTimes(1)
  })

  test('commits transaction once on success', async () => {
    await run()
    expect(mockCommit).toHaveBeenCalledTimes(1)
    expect(mockRollback).not.toHaveBeenCalled()
  })

  // ----- saveOrganisation fails -----
  describe('when saveOrganisation throws', () => {
    const msg = 'Database save down issue'

    beforeEach(() => {
      saveOrganisation.mockRejectedValue(new Error(msg))
    })

    test.each([
      ['throws generic', undefined],
      ['throws Error object', Error],
      ['throws specific message', new RegExp(`^${msg}$`)]
    ])('%s', async (_, matcher) => {
      const call = run()
      matcher
        ? await expect(call).rejects.toThrow(matcher)
        : await expect(call).rejects.toThrow()
    })

    test('rolls back transaction', async () => {
      try { await run() } catch {}
      expect(mockRollback).toHaveBeenCalledTimes(1)
    })
  })

  // ----- commit fails -----
  describe('when transaction.commit throws', () => {
    const msg = 'Sequelize transaction commit issue'

    beforeEach(() => {
      mockCommit.mockRejectedValue(new Error(msg))
    })

    test.each([
      ['throws generic', undefined],
      ['throws Error object', Error],
      ['throws specific message', new RegExp(`^${msg}$`)]
    ])('%s', async (_, matcher) => {
      const call = run()
      matcher
        ? await expect(call).rejects.toThrow(matcher)
        : await expect(call).rejects.toThrow()
    })

    test('rolls back transaction', async () => {
      try { await run() } catch {}
      expect(mockRollback).toHaveBeenCalledTimes(1)
    })
  })
})

const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = { commit: mockCommit, rollback: mockRollback }

jest.mock('../../../../app/data', () => ({
  sequelize: { transaction: jest.fn().mockResolvedValue({ ...mockTransaction }) }
}))

jest.mock('../../../../app/inbound/organisation/save-organisation')
const saveOrganisation = require('../../../../app/inbound/organisation/save-organisation')

jest.mock('../../../../app/inbound/organisation/check-and-remove-empty-address')
const { checkAndRemoveEmptyAddress } = require('../../../../app/inbound/organisation/check-and-remove-empty-address')

jest.mock('../../../../app/inbound/organisation/validate-organisation')
const validateOrganisation = require('../../../../app/inbound/organisation/validate-organisation')

const processOrganisation = require('../../../../app/inbound/organisation')

let organisation

describe('processOrganisation', () => {
  beforeEach(() => {
    const original = require('../../../mock-objects/mock-organisation')
    organisation = { ...original }

    saveOrganisation.mockResolvedValue(undefined)
    checkAndRemoveEmptyAddress.mockResolvedValue(false)
    jest.clearAllMocks()
  })

  const run = () => processOrganisation(organisation)

  test('calls checkAndRemoveEmptyAddress', async () => {
    await run()
    expect(checkAndRemoveEmptyAddress).toHaveBeenCalledWith(organisation, mockTransaction)
  })

  test('calls validateOrganisation and saveOrganisation when not removed', async () => {
    checkAndRemoveEmptyAddress.mockResolvedValue(false)

    await run()

    expect(validateOrganisation).toHaveBeenCalledWith(organisation, organisation.sbi)
    expect(saveOrganisation).toHaveBeenCalledWith(organisation, mockTransaction)
  })

  test('does NOT call validateOrganisation or saveOrganisation if removed', async () => {
    checkAndRemoveEmptyAddress.mockResolvedValue(true)

    await run()

    expect(validateOrganisation).not.toHaveBeenCalled()
    expect(saveOrganisation).not.toHaveBeenCalled()
  })

  test('commits transaction once on success', async () => {
    await run()
    expect(mockCommit).toHaveBeenCalledTimes(1)
    expect(mockRollback).not.toHaveBeenCalled()
  })

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

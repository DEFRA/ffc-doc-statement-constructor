const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['organisations'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const savePlaceholderOrganisation = require('../../../../app/inbound/delinked/save-placeholder-organisation')

describe('savePlaceholderOrganisation', () => {
  const transaction = mockDb.trx
  const organisation = { name: 'Placeholder', frn: 1234567890 }
  const sbi = 123456789

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('inserts the organisation with the sbi, ignoring conflicts, against the transaction', async () => {
    await expect(savePlaceholderOrganisation(organisation, sbi, transaction)).resolves.toBeUndefined()

    expect(mockDb.tables.organisations).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.insert).toHaveBeenCalledWith({ ...organisation, sbi })
    expect(mockDb.builder.onConflict).toHaveBeenCalledWith('sbi')
    expect(mockDb.builder.ignore).toHaveBeenCalledTimes(1)
  })

  test('propagates an insert failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(savePlaceholderOrganisation(organisation, sbi, transaction)).rejects.toThrow('DB error')
  })
})

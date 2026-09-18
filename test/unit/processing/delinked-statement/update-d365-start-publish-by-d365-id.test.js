const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['d365'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const updateD365StartPublishByD365Id = require('../../../../app/processing/delinked-statement/update-d365-start-publish-by-d365-id')

describe('updateD365StartPublishByD365Id', () => {
  const transaction = mockDb.trx
  const d365Id = 7
  const started = new Date('2026-09-18T10:00:00.000Z')

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(1)
  })

  test('sets startPublish and lastProcessAttempt against the transaction', async () => {
    await expect(updateD365StartPublishByD365Id(d365Id, started, transaction)).resolves.toBeUndefined()

    expect(mockDb.tables.d365).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ d365Id })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ startPublish: started, lastProcessAttempt: started })
  })

  test('propagates an update failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(updateD365StartPublishByD365Id(d365Id, started, transaction)).rejects.toThrow('DB error')
  })
})

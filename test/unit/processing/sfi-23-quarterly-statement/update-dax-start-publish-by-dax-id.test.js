const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['dax'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const updateDaxStartPublishByDaxId = require('../../../../app/processing/sfi-23-quarterly-statement/update-dax-start-publish-by-dax-id')

describe('updateDaxStartPublishByDaxId', () => {
  const transaction = mockDb.trx
  const daxId = 7
  const started = new Date('2026-09-18T10:00:00.000Z')

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(1)
  })

  test('sets startPublish and lastProcessAttempt against the transaction', async () => {
    await expect(updateDaxStartPublishByDaxId(daxId, started, transaction)).resolves.toBeUndefined()

    expect(mockDb.tables.dax).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ daxId })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ startPublish: started, lastProcessAttempt: started })
  })

  test('propagates an update failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(updateDaxStartPublishByDaxId(daxId, started, transaction)).rejects.toThrow('DB error')
  })
})

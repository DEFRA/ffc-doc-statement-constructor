const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['dax'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const resetDaxUnCompletePublishByDaxId = require('../../../../app/processing/sfi-23-quarterly-statement/reset-dax-un-complete-publish-by-dax-id')

describe('resetDaxUnCompletePublishByDaxId', () => {
  const daxId = 7

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(1)
  })

  test('clears startPublish only where publishing has not completed', async () => {
    await expect(resetDaxUnCompletePublishByDaxId(daxId)).resolves.toBeUndefined()

    expect(mockDb.tables.dax).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ daxId })
    expect(mockDb.builder.whereNull).toHaveBeenCalledWith('completePublish')
    expect(mockDb.builder.update).toHaveBeenCalledWith({ startPublish: null })
  })

  test('propagates an update failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(resetDaxUnCompletePublishByDaxId(daxId)).rejects.toThrow('DB error')
  })
})

const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['dax'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const updateDaxCompletePublishByDaxId = require('../../../../app/processing/sfi-23-quarterly-statement/update-dax-complete-publish-by-dax-id')

describe('updateDaxCompletePublishByDaxId', () => {
  const daxId = 7

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers().setSystemTime(new Date('2026-09-18T10:00:00.000Z'))
    mockDb.builder.resolves(1)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('sets completePublish to now for the row', async () => {
    await expect(updateDaxCompletePublishByDaxId(daxId)).resolves.toBeUndefined()

    expect(mockDb.tables.dax).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ daxId })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ completePublish: new Date('2026-09-18T10:00:00.000Z') })
  })

  test('propagates an update failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(updateDaxCompletePublishByDaxId(daxId)).rejects.toThrow('DB error')
  })
})

const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['d365'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const updateD365CompletePublishByD365Id = require('../../../../app/processing/delinked-statement/update-d365-complete-publish-by-d365-id')

describe('updateD365CompletePublishByD365Id', () => {
  const d365Id = 7

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers().setSystemTime(new Date('2026-09-18T10:00:00.000Z'))
    mockDb.builder.resolves(1)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('sets completePublish to now for the row', async () => {
    await expect(updateD365CompletePublishByD365Id(d365Id)).resolves.toBeUndefined()

    expect(mockDb.tables.d365).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ d365Id })
    expect(mockDb.builder.update).toHaveBeenCalledWith({ completePublish: new Date('2026-09-18T10:00:00.000Z') })
  })

  test('propagates an update failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(updateD365CompletePublishByD365Id(d365Id)).rejects.toThrow('DB error')
  })
})

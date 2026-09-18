const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['documents'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const saveDocument = require('../../../../app/processing/sfi-23-quarterly-statement/save-document')

describe('saveDocument', () => {
  const document = { documentTypeId: 1, documentSourceReference: 'REF-1' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('inserts the document and returns the saved row', async () => {
    mockDb.builder.resolves([{ documentId: 99 }])

    const result = await saveDocument(document)

    expect(mockDb.tables.documents).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.insert).toHaveBeenCalledWith(document)
    expect(mockDb.builder.returning).toHaveBeenCalledWith('documentId')
    expect(result).toEqual({ documentId: 99 })
  })

  test('propagates an insert failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))

    await expect(saveDocument(document)).rejects.toThrow('DB error')
  })
})

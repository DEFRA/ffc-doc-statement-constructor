const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['documentTypes'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getDocumentTypeByCode = require('../../../../app/processing/delinked-statement/get-document-type-by-code')

describe('getDocumentTypeByCode', () => {
  const mockDocumentType = { documentTypeId: 1 }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test.each([
    {
      name: 'returns document type data when found',
      code: 'DOC123',
      mockReturn: mockDocumentType,
      expected: mockDocumentType,
      shouldThrow: false
    },
    {
      name: 'throws an error when no document type is found',
      code: 'DOC123',
      mockReturn: undefined,
      expected: 'Document type with code DOC123 not found',
      shouldThrow: true
    }
  ])('$name', async ({ code, mockReturn, expected, shouldThrow }) => {
    mockDb.builder.resolves(mockReturn)

    if (shouldThrow) {
      await expect(getDocumentTypeByCode(code)).rejects.toThrow(expected)
    } else {
      const result = await getDocumentTypeByCode(code)
      expect(result).toEqual(expected)
    }

    expect(mockDb.builder.select).toHaveBeenCalledWith('documentTypeId')
    expect(mockDb.builder.where).toHaveBeenCalledWith({ code })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
  })
})

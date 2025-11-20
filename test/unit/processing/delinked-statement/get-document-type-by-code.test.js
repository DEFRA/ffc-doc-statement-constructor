const db = require('../../../../app/data')
const getDocumentTypeByCode = require('../../../../app/processing/delinked-statement/get-document-type-by-code')

jest.mock('../../../../app/data')

describe('getDocumentTypeByCode', () => {
  const mockDocumentType = { documentTypeId: 1 }

  beforeEach(() => {
    db.documentType.findOne.mockReset()
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
      mockReturn: null,
      expected: 'Document type with code DOC123 not found',
      shouldThrow: true
    }
  ])('$name', async ({ code, mockReturn, expected, shouldThrow }) => {
    db.documentType.findOne.mockResolvedValue(mockReturn)

    if (shouldThrow) {
      await expect(getDocumentTypeByCode(code)).rejects.toThrow(expected)
    } else {
      const result = await getDocumentTypeByCode(code)
      expect(result).toEqual(expected)
    }

    expect(db.documentType.findOne).toHaveBeenCalledWith({
      attributes: ['documentTypeId'],
      where: { code },
      raw: true
    })
  })
})

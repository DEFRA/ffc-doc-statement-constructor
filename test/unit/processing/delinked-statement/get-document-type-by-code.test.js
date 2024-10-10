const db = require('../../../../app/data')
const getDocumentTypeByCode = require('../../../../app/processing/delinked-statement/get-document-type-by-code')

jest.mock('../../../../app/data')

describe('getDocumentTypeByCode', () => {
  const mockDocumentType = {
    documentTypeId: 1
  }

  beforeEach(() => {
    db.documentType.findOne.mockReset()
  })

  test('should return document type data when found', async () => {
    db.documentType.findOne.mockResolvedValue(mockDocumentType)

    const result = await getDocumentTypeByCode('DOC123')

    expect(result).toEqual(mockDocumentType)
    expect(db.documentType.findOne).toHaveBeenCalledWith({
      attributes: ['documentTypeId'],
      where: { code: 'DOC123' },
      raw: true
    })
  })

  test('should throw an error when no document type is found', async () => {
    db.documentType.findOne.mockResolvedValue(null)

    await expect(getDocumentTypeByCode('DOC123')).rejects.toThrow('Document type with code DOC123 not found')
    expect(db.documentType.findOne).toHaveBeenCalledWith({
      attributes: ['documentTypeId'],
      where: { code: 'DOC123' },
      raw: true
    })
  })
})

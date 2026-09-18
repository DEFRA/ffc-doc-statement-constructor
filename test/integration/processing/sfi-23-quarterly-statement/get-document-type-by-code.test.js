const db = require('../../../../app/data')
const { truncate } = require('../../../helpers/truncate')

const getDocumentTypeByCode = require('../../../../app/processing/sfi-23-quarterly-statement/get-document-type-by-code')

const documentTypeCode = 'SFI23-STATEMENT'

let documentTypes

describe('process get document type by code', () => {
  beforeAll(async () => {
    await truncate()
  })

  beforeEach(async () => {
    documentTypes = structuredClone(require('../../../mock-objects/mock-document-types'))
    documentTypes[0].code = documentTypeCode
    await db.documentTypes().insert(documentTypes)
  })

  afterEach(async () => {
    await truncate()
  })

  afterAll(async () => {
    await db.close()
  })

  test('getDocumentTypeByCode returns when present', async () => {
    const result = await getDocumentTypeByCode(documentTypeCode)
    expect(result.documentTypeId).toBe(documentTypes[0].documentTypeId)
  })

  test('getDocumentTypeByCode returns null when absent', async () => {
    const result = await getDocumentTypeByCode('NOT-A-CODE')
    expect(result).toBeNull()
  })
})

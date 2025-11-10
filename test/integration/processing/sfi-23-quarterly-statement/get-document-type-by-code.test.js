const db = require('../../../../app/data')
const getDocumentTypeByCode = require('../../../../app/processing/sfi-23-quarterly-statement/get-document-type-by-code')

const documentTypeCode = 'SFI23-STATEMENT'

describe('getDocumentTypeByCode', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const documentTypes = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-document-types')))
    documentTypes[0].code = documentTypeCode
    await db.documentType.bulkCreate(documentTypes)
  })

  afterEach(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should return the document type when a matching code exists', async () => {
    const result = await getDocumentTypeByCode(documentTypeCode)
    expect(result).toBeDefined()
    expect(result.code).toBe(documentTypeCode)
  })

  test('should return null when no matching document type exists', async () => {
    const result = await getDocumentTypeByCode('NON_EXISTENT_CODE')
    expect(result).toBeNull()
  })
})

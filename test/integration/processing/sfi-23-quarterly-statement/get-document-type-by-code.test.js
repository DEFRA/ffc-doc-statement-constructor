const db = require('../../../../app/data')

const getDocumentTypeByCode = require('../../../../app/processing/sfi-23-quarterly-statement/get-document-type-by-code')

const documentTypeCode = 'SFI23-STATEMENT'

let documentTypes

describe('process get document type by code', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    documentTypes = structuredClone(require('../../../mock-objects/mock-document-types'))
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

  test('getDocumentTypeByCode returns when present', async () => {
    const result = await getDocumentTypeByCode(documentTypeCode)
    expect(result.documentTypeId).toBe(documentTypes[0].documentTypeId)
  })
})

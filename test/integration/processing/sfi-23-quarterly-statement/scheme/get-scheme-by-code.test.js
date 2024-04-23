const db = require('../../../../../app/data')
const getSchemeByCode = require('../../../../../app/processing/sfi-23-quarterly-statement/scheme/get-scheme-by-code')

describe('getSchemeByCode', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should return the scheme with the provided code', async () => {
    const code = 'ABC123'
    const scheme = {
      name: 'Scheme 1',
      code: 'ABC123'
    }
    await db.scheme.create(scheme)

    const result = await getSchemeByCode(code)

    expect(result).toEqual(scheme)
  })

  test('should return null when no scheme is found with the provided code', async () => {
    const code = 'XYZ789'

    const result = await getSchemeByCode(code)

    expect(result).toBeNull()
  })
})

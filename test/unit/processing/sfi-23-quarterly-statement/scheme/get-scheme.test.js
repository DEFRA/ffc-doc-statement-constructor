const getScheme = require('../../../../../app/processing/sfi-23-quarterly-statement/scheme/get-scheme')

jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/scheme/get-scheme-by-code')
const getSchemeByCode = require('../../../../../app/processing/sfi-23-quarterly-statement/scheme/get-scheme-by-code')

jest.mock('../../../../../app/processing/sfi-23-quarterly-statement/scheme/validate-scheme')
const validateScheme = require('../../../../../app/processing/sfi-23-quarterly-statement/scheme/validate-scheme')

describe('getDax', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getSchemeByCode with the correct scheme code', async () => {
    const schemeCode = 'ABC123'
    await getScheme(schemeCode)
    expect(getSchemeByCode).toHaveBeenCalledWith(schemeCode)
  })

  test('should call validateScheme with the returned scheme and scheme code', async () => {
    const schemeCode = 'ABC123'
    const scheme = { /* mocked scheme object */ }
    getSchemeByCode.mockResolvedValue(scheme)
    await getScheme(schemeCode)
    expect(validateScheme).toHaveBeenCalledWith(scheme, schemeCode)
  })

  test('should return the validated scheme', async () => {
    const schemeCode = 'ABC123'
    const validatedScheme = { /* mocked validated dax object */ }
    validateScheme.mockReturnValue(validatedScheme)
    const result = await getScheme(schemeCode)
    expect(result).toBe(validatedScheme)
  })
})

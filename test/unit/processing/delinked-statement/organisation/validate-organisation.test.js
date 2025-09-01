jest.mock('../../../../../app/processing/delinked-statement/organisation/schema')
jest.mock('../../../../../app/utility/processing-alerts', () => ({ dataProcessingAlert: jest.fn() }))

const validateOrganisation = require('../../../../../app/processing/delinked-statement/organisation/validate-organisation')
const schema = require('../../../../../app/processing/delinked-statement/organisation/schema')
const { dataProcessingAlert } = require('../../../../../app/utility/processing-alerts')
const { DATA_PROCESSING_ERROR } = require('../../../../../app/constants/alerts')

describe('validate Organisation', () => {
  const sbi = '123456789'
  const validOrganisation = { name: 'Test Organisation', id: 'org123' }
  const invalidOrganisation = { name: '' }

  beforeEach(() => {
    jest.clearAllMocks()
    schema.validate.mockReturnValue({ value: validOrganisation })
    dataProcessingAlert.mockReset()
  })

  afterEach(() => {
    if (console.error && console.error.mockRestore) {
      console.error.mockRestore()
    }
    jest.clearAllMocks()
  })

  test('should return validated organisation when schema validation passes', () => {
    const result = validateOrganisation(validOrganisation, sbi)
    expect(result).toEqual(validOrganisation)
    expect(schema.validate).toHaveBeenCalledWith(validOrganisation, { abortEarly: false })
  })

  test('should throw when schema.validate throws', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateOrganisation(invalidOrganisation, sbi)).toThrow()
  })

  test('should throw Error when schema.validate throws Error', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateOrganisation(invalidOrganisation, sbi)).toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateOrganisation(invalidOrganisation, sbi)).toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key and call dataProcessingAlert', () => {
    const validationError = new Error('Validation error')
    schema.validate.mockReturnValue({ error: validationError })
    dataProcessingAlert.mockResolvedValue()
    expect(() => validateOrganisation(invalidOrganisation, sbi)).toThrow()
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    const alertArg = dataProcessingAlert.mock.calls[0][0]
    const alertType = dataProcessingAlert.mock.calls[0][1]
    expect(alertArg.process).toBe('validateOrganisation (Delinked)')
    expect(alertArg.sbi).toBe(sbi)
    expect(alertArg.error).toBe(validationError.message)
    expect(alertArg.message).toMatch(/Organisation with the sbi: .* does not have the required details data/)
    expect(alertType).toBe(DATA_PROCESSING_ERROR)
  })

  test('should throw Error when schema.validate returns with error key', () => {
    const validationError = new Error('Validation error')
    schema.validate.mockReturnValue({ error: validationError })
    dataProcessingAlert.mockResolvedValue()
    expect(() => validateOrganisation(invalidOrganisation, sbi)).toThrow(Error)
  })

  test('should throw error which has in it "does not have the required details data" when schema.validate returns with error key of "Not a valid object"', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    dataProcessingAlert.mockResolvedValue()
    expect(() => validateOrganisation(invalidOrganisation, sbi)).toThrow('Organisation with the sbi: 123456789 does not have the required details data: Not a valid object')
  })

  test('should log console.error and still throw when dataProcessingAlert itself throws', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    const alertError = new Error('alert failure')
    dataProcessingAlert.mockRejectedValue(alertError)
    jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => validateOrganisation(invalidOrganisation, sbi)).toThrow('Organisation with the sbi: 123456789 does not have the required details data: Not a valid object')
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    await new Promise(resolve => setImmediate(resolve))
    expect(console.error).toHaveBeenCalledTimes(1)
    const loggedMessage = console.error.mock.calls[0][0]
    const loggedObject = console.error.mock.calls[0][1]
    expect(loggedMessage).toBe('Organisation with the sbi: 123456789 does not have the required details data:')
    expect(loggedObject).toHaveProperty('originalError', 'Not a valid object')
    expect(loggedObject).toHaveProperty('alertError')
    expect(loggedObject.alertError).toBe(alertError)
  })
})

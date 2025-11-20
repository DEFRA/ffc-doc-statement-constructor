jest.mock('../../../../app/processing/organisation/schema')
jest.mock('ffc-alerting-utils', () => ({ dataProcessingAlert: jest.fn() }))

const schema = require('../../../../app/processing/organisation/schema')
const { dataProcessingAlert } = require('ffc-alerting-utils')
const { DATA_PROCESSING_ERROR } = require('../../../../app/constants/alerts')
const validateOrganisation = require('../../../../app/processing/organisation/validate-organisation')

describe('validate Organisation', () => {
  const sbi = '123456789'
  let retrievedOrganisation
  const invalidOrganisation = { name: '' }

  beforeEach(() => {
    jest.clearAllMocks()
    retrievedOrganisation = structuredClone(require('../../../mock-objects/mock-organisation'))
    schema.validate.mockReturnValue({ value: retrievedOrganisation })
    dataProcessingAlert.mockReset()
  })

  afterEach(() => {
    if (console.error && console.error.mockRestore) {
      console.error.mockRestore()
    }
    jest.clearAllMocks()
  })

  test('should return validated organisation when schema validation passes', () => {
    const result = validateOrganisation(retrievedOrganisation, sbi)
    expect(result).toEqual(retrievedOrganisation)
    expect(schema.validate).toHaveBeenCalledWith(retrievedOrganisation, { abortEarly: false })
  })

  test.each([
    ['throws generic Error', new Error('Joi validation issue')]
  ])('should throw when schema.validate %s', (_, thrownError) => {
    schema.validate.mockImplementation(() => { throw thrownError })
    expect(() => validateOrganisation(invalidOrganisation, sbi)).toThrow(thrownError)
  })

  test.each([
    ['Validation error', new Error('Validation error')],
    ['Not a valid object', 'Not a valid object']
  ])('should throw when schema.validate returns error: %s', (_, validationError) => {
    schema.validate.mockReturnValue({ error: validationError })
    dataProcessingAlert.mockResolvedValue()
    const thrown = () => validateOrganisation(invalidOrganisation, sbi)
    expect(thrown).toThrow()
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    const alertArg = dataProcessingAlert.mock.calls[0][0]
    const alertType = dataProcessingAlert.mock.calls[0][1]
    expect(alertArg.process).toBe('validateOrganisation')
    expect(alertArg.sbi).toBe(sbi)
    expect(alertArg.error).toBe(validationError instanceof Error ? validationError.message : validationError)
    expect(alertArg.message).toMatch(/Organisation with the sbi: .* does not have the required details data/)
    expect(alertType).toBe(DATA_PROCESSING_ERROR)
  })

  test('should call updateD365CompletePublishByD365Id when error category is VALIDATION', async () => {
    const validationError = new Error('Validation error')
    validationError.category = 'VALIDATION'
    schema.validate.mockReturnValue({ error: validationError })
    dataProcessingAlert.mockResolvedValue()
    expect(() => validateOrganisation(invalidOrganisation, sbi)).toThrow('Organisation with the sbi: 123456789 does not have the required details data: Validation error')
  })

  test('should log console.error and still throw when dataProcessingAlert itself throws', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    const alertError = new Error('alert failure')
    dataProcessingAlert.mockRejectedValue(alertError)

    jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => validateOrganisation(invalidOrganisation, sbi)).toThrow(
      'Organisation with the sbi: 123456789 does not have the required details data: Not a valid object'
    )
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

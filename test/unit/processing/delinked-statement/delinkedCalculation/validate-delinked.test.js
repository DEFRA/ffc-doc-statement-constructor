jest.mock('../../../../../app/processing/delinked-statement/delinkedCalculation/schema')
jest.mock('ffc-alerting-utils', () => ({ dataProcessingAlert: jest.fn() }))

const schema = require('../../../../../app/processing/delinked-statement/delinkedCalculation/schema')
const { dataProcessingAlert } = require('ffc-alerting-utils')
const { DATA_PROCESSING_ERROR } = require('../../../../../app/constants/alerts')

const validateDelinked = require('../../../../../app/processing/delinked-statement/delinkedCalculation/validate-delinked')

let retrievedDelinked

describe('validate delinked', () => {
  beforeEach(() => {
    retrievedDelinked = structuredClone(require('../../../../mock-objects/mock-delinked'))
    schema.validate.mockReturnValue({ value: retrievedDelinked })
    dataProcessingAlert.mockReset()
  })

  afterEach(() => {
    jest.clearAllMocks()
    if (console.error.mockRestore) {
      console.error.mockRestore()
    }
  })

  test('should return retrievedDelinked', () => {
    const result = validateDelinked(retrievedDelinked)
    expect(result).toBe(retrievedDelinked)
  })

  test('should throw when schema.validate throws', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateDelinked(retrievedDelinked)).toThrow()
  })

  test('should throw Error when schema.validate throws Error', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateDelinked(retrievedDelinked)).toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateDelinked(retrievedDelinked)).toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key and call dataProcessingAlert', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    dataProcessingAlert.mockResolvedValue()
    expect(() => validateDelinked(retrievedDelinked)).toThrow()
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    const alertArg = dataProcessingAlert.mock.calls[0][0]
    const alertType = dataProcessingAlert.mock.calls[0][1]
    expect(alertArg.process).toBe('validateDelinked')
    expect(alertArg.calculationId).toBeUndefined()
    expect(alertArg.error).toBeUndefined()
    expect(alertArg.message).toMatch(/Delinked with the CalculationId: .* does not have the required details data/)
    expect(alertType).toBe(DATA_PROCESSING_ERROR)
  })

  test('should throw Error when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    dataProcessingAlert.mockResolvedValue()
    expect(() => validateDelinked(retrievedDelinked)).toThrow(Error)
  })

  test('should throw error which has in it "does not have the required data" when schema.validate returns with error key of "Not a valid object"', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    dataProcessingAlert.mockResolvedValue()
    expect(() => validateDelinked(retrievedDelinked)).toThrow('Delinked with the CalculationId: undefined does not have the required details data: undefined')
  })

  test('should log console.error and still throw when dataProcessingAlert itself throws', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    const alertError = new Error('alert failure')
    dataProcessingAlert.mockRejectedValue(alertError)
    jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => validateDelinked(retrievedDelinked)).toThrow('Delinked with the CalculationId: undefined does not have the required details data: undefined')
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    await new Promise(resolve => setImmediate(resolve))
    expect(console.error).toHaveBeenCalledTimes(1)
    const loggedMessage = console.error.mock.calls[0][0]
    const loggedObject = console.error.mock.calls[0][1]
    expect(loggedMessage).toBe('Delinked with the CalculationId: undefined does not have the required details data:')
    expect(loggedObject).toHaveProperty('originalError', undefined)
    expect(loggedObject).toHaveProperty('alertError')
    expect(loggedObject.alertError).toBe(alertError)
  })
})

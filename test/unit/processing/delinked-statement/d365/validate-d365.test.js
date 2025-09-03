jest.mock('../../../../../app/processing/delinked-statement/d365/schema')
jest.mock('../../../../../app/utility/processing-alerts', () => ({ dataProcessingAlert: jest.fn() }))

const schema = require('../../../../../app/processing/delinked-statement/d365/schema')
const { dataProcessingAlert } = require('../../../../../app/utility/processing-alerts')
const { DATA_PROCESSING_ERROR } = require('../../../../../app/constants/alerts')

const validateD365 = require('../../../../../app/processing/delinked-statement/d365/validate-d365')

let retrievedD365

describe('validate d365', () => {
  beforeEach(() => {
    retrievedD365 = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-d365')))
    schema.validate.mockReturnValue({ value: retrievedD365 })
    dataProcessingAlert.mockReset()
  })

  afterEach(() => {
    jest.clearAllMocks()
    if (console.error.mockRestore) {
      console.error.mockRestore()
    }
  })

  test('should return retrievedD365', () => {
    const result = validateD365(retrievedD365)
    expect(result).toBe(retrievedD365)
  })

  test('should return retrievedD365 and not throw error when no paymentPeriod', () => {
    delete retrievedD365.paymentPeriod
    const result = validateD365(retrievedD365)
    expect(result).toBe(retrievedD365)
  })

  test('should throw when schema.validate throws', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateD365(retrievedD365)).toThrow()
  })

  test('should throw Error when schema.validate throws Error', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateD365(retrievedD365)).toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateD365(retrievedD365)).toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key and call dataProcessingAlert', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    dataProcessingAlert.mockResolvedValue()
    expect(() => validateD365(retrievedD365)).toThrow()
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    const alertArg = dataProcessingAlert.mock.calls[0][0]
    const alertType = dataProcessingAlert.mock.calls[0][1]
    expect(alertArg.process).toBe('validateD365')
    expect(alertArg.paymentReference).toBeUndefined()
    expect(alertArg.error).toBeUndefined()
    expect(alertArg.message).toMatch(/D365 record with the payment reference: .* does not have the required details data/)
    expect(alertType).toBe(DATA_PROCESSING_ERROR)
  })

  test('should throw Error when schema.validate returns with error key', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    dataProcessingAlert.mockResolvedValue()
    expect(() => validateD365(retrievedD365)).toThrow(Error)
  })

  test('should throw error which has in it "does not have the required data" when schema.validate returns with error key of "Not a valid object"', () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    dataProcessingAlert.mockResolvedValue()
    expect(() => validateD365(retrievedD365)).toThrow('D365 record with the payment reference: undefined does not have the required details data: Not a valid object')
  })

  test('should log console.error and still throw when dataProcessingAlert itself throws', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    const alertError = new Error('alert failure')
    dataProcessingAlert.mockRejectedValue(alertError)
    jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => validateD365(retrievedD365)).toThrow('D365 record with the payment reference: undefined does not have the required details data: Not a valid object')
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    await new Promise(resolve => setImmediate(resolve))
    expect(console.error).toHaveBeenCalledTimes(1)
    const loggedMessage = console.error.mock.calls[0][0]
    const loggedObject = console.error.mock.calls[0][1]
    expect(loggedMessage).toBe('D365 record with the payment reference: undefined does not have the required details data')
    expect(loggedObject).toHaveProperty('originalError', undefined)
    expect(loggedObject).toHaveProperty('alertError')
    expect(loggedObject.alertError).toBe(alertError)
  })
})

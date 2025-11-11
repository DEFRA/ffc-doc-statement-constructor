jest.mock('../../../../../app/processing/delinked-statement/d365/schema')
jest.mock('ffc-alerting-utils', () => ({ dataProcessingAlert: jest.fn() }))

const schema = require('../../../../../app/processing/delinked-statement/d365/schema')
const { dataProcessingAlert } = require('ffc-alerting-utils')
const { DATA_PROCESSING_ERROR } = require('../../../../../app/constants/alerts')
const validateD365 = require('../../../../../app/processing/delinked-statement/d365/validate-d365')

let retrievedD365

describe('validateD365', () => {
  beforeEach(() => {
    retrievedD365 = JSON.parse(JSON.stringify(require('../../../../mock-objects/mock-d365')))
    schema.validate.mockReturnValue({ value: retrievedD365 })
    dataProcessingAlert.mockReset()
  })

  afterEach(() => {
    jest.clearAllMocks()
    if (console.error?.mockRestore) console.error.mockRestore()
  })

  test('returns the object when validation passes', () => {
    expect(validateD365(retrievedD365)).toBe(retrievedD365)
  })

  test('returns the object even if paymentPeriod is missing', () => {
    delete retrievedD365.paymentPeriod
    expect(validateD365(retrievedD365)).toBe(retrievedD365)
  })

  test('throws if schema.validate throws', () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })
    expect(() => validateD365(retrievedD365)).toThrow('Joi validation issue')
  })

  test('throws if schema.validate returns an error and calls dataProcessingAlert', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    dataProcessingAlert.mockResolvedValue()

    expect(() => validateD365(retrievedD365)).toThrow(/does not have the required details data/)
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)

    const alertArg = dataProcessingAlert.mock.calls[0][0]
    const alertType = dataProcessingAlert.mock.calls[0][1]
    expect(alertArg.process).toBe('validateD365')
    expect(alertArg.message).toMatch(/D365 record with the payment reference: .* does not have the required details data/)
    expect(alertType).toBe(DATA_PROCESSING_ERROR)
  })

  test('logs console.error and still throws if dataProcessingAlert fails', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })
    const alertError = new Error('alert failure')
    dataProcessingAlert.mockRejectedValue(alertError)

    jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => validateD365(retrievedD365)).toThrow(/does not have the required details data/)
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)

    await new Promise(resolve => setImmediate(resolve))
    expect(console.error).toHaveBeenCalledTimes(1)
    const [loggedMessage, loggedObject] = console.error.mock.calls[0]
    expect(loggedMessage).toMatch(/does not have the required details data/)
    expect(loggedObject).toHaveProperty('alertError', alertError)
  })
})

jest.mock('../../../../app/processing/calculation/schema')
const schema = require('../../../../app/processing/calculation/schema')

const validateCalculation = require('../../../../app/processing/calculation/validate-calculation')

let retrievedCalculation

describe('validate payment request', () => {
  beforeEach(() => {
    retrievedCalculation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation')))

    schema.validate.mockReturnValue({ value: retrievedCalculation })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retreivedPaymentRequest', async () => {
    const result = validateCalculation(retrievedCalculation)
    expect(result).toBe(retrievedCalculation)
  })

  test('should throw when schema.validate throws', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validateCalculation(retrievedCalculation)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate throws Error', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validateCalculation(retrievedCalculation)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validateCalculation(retrievedCalculation)
    }

    expect(wrapper).rejects.toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validateCalculation(retrievedCalculation)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validateCalculation(retrievedCalculation)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which has in it "Payment request with paymentRequestId:" when schema.validate returns with error key of "Not a valid calculation"', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validateCalculation(retrievedCalculation)
    }

    expect(wrapper).rejects.toThrow(/Payment request with paymentRequestId:/)
  })
})

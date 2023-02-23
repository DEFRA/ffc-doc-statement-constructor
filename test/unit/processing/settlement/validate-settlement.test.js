jest.mock('../../../../app/processing/settlement/schema')
const schema = require('../../../../app/processing/settlement/schema')

const validateSettlement = require('../../../../app/processing/settlement/validate-settlement')

let retrievedSettlement

describe('validate settlement', () => {
  beforeEach(() => {
    const settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))

    retrievedSettlement = {
      paymentRequestId: 1,
      reference: settlement.reference,
      settled: settlement.settled
    }

    schema.validate.mockReturnValue({ value: retrievedSettlement })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retrievedSettlement', async () => {
    const result = validateSettlement(retrievedSettlement)
    expect(result).toBe(retrievedSettlement)
  })

  test('should throw when schema.validate throws', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate throws Error', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which has in it "does not have the required data" when schema.validate returns with error key of "Not a valid object"', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validateSettlement(retrievedSettlement)
    }

    expect(wrapper).rejects.toThrow(/does not have the required data/)
  })
})

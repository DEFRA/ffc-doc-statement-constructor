jest.mock('../../../../app/processing/organisation/schema')
const schema = require('../../../../app/processing/organisation/schema')

const validateOrganisation = require('../../../../app/processing/organisation/validate-organisation')

let retrievedOrganisation

describe('validate payment request', () => {
  beforeEach(() => {
    retrievedOrganisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))

    schema.validate.mockReturnValue({ value: retrievedOrganisation })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return retreivedPaymentRequest', async () => {
    const result = validateOrganisation(retrievedOrganisation)
    expect(result).toBe(retrievedOrganisation)
  })

  test('should throw when schema.validate throws', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validateOrganisation(retrievedOrganisation)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate throws Error', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validateOrganisation(retrievedOrganisation)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error "Joi validation issue" when schema.validate throws with "Joi validation issue"', async () => {
    schema.validate.mockImplementation(() => { throw new Error('Joi validation issue') })

    const wrapper = async () => {
      validateOrganisation(retrievedOrganisation)
    }

    expect(wrapper).rejects.toThrow(/^Joi validation issue$/)
  })

  test('should throw when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validateOrganisation(retrievedOrganisation)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validateOrganisation(retrievedOrganisation)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which has in it "Organisation with the sbi:" when schema.validate returns with error key of "Not a valid organisation"', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      validateOrganisation(retrievedOrganisation)
    }

    expect(wrapper).rejects.toThrow(/Organisation with the sbi:/)
  })
})

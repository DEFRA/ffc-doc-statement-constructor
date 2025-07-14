const db = require('../../../../app/data')
const schema = require('../../../../app/inbound/dax/schema')
const validateDax = require('../../../../app/inbound/dax/validate-dax')

jest.mock('../../../../app/data', () => ({
  dax: {
    create: jest.fn()
  }
}))

const saveDax = require('../../../../app/inbound/dax/save-dax')

jest.mock('../../../../app/inbound/dax/schema', () => ({
  validate: jest.fn()
}))

describe('validateDax', () => {
  test('should call schema.validate with dax and options', () => {
    const dax = {
      calculationReference: 'calculationReference',
      otherProperty: 'otherProperty'
    }
    const paymentReference = 'paymentReference'

    const options = {
      abortEarly: false
    }

    schema.validate.mockReturnValueOnce({ error: null, value: dax })

    const result = validateDax(dax, paymentReference)

    expect(schema.validate).toHaveBeenCalledWith(dax, options)
    expect(result).toEqual(dax)
  })

  test('should throw an error if schema.validate returns an error', () => {
    const dax = {
      calculationReference: 'calculationReference',
      otherProperty: 'otherProperty'
    }
    const paymentReference = 'paymentReference'

    const errorMessage = 'Validation error'
    schema.validate.mockReturnValueOnce({ error: new Error(errorMessage), value: null })

    expect(() => validateDax(dax, paymentReference)).toThrow(`Dax validation on paymentReference: ${paymentReference} does not have the required DAX data: ${errorMessage}`)
  })
})

describe('saveDax', () => {
  test('should call db.dax.create with transformedDax and transaction', async () => {
    const dax = {
      calculationReference: 'calculationReference',
      otherProperty: 'otherProperty'
    }
    const transaction = {}
    const transformedDax = {
      ...dax,
      calculationId: dax.calculationReference
    }
    delete transformedDax.calculationReference

    await saveDax(dax, transaction)

    expect(db.dax.create).toHaveBeenCalledWith(transformedDax, { transaction })
  })
  test('should throw an error if db.dax.create throws an error', async () => {
    const dax = {
      calculationReference: 'calculationReference',
      otherProperty: 'otherProperty'
    }
    const transaction = {}
    const errorMessage = 'Database error'

    db.dax.create.mockRejectedValueOnce(new Error(errorMessage))

    await expect(saveDax(dax, transaction)).rejects.toThrow(errorMessage)
  })
})

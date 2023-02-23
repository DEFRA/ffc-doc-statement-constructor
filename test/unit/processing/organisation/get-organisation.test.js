const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../../app/data', () => {
  return {
    sequelize:
       {
         transaction: jest.fn().mockImplementation(() => {
           return { ...mockTransaction }
         })
       }
  }
})

jest.mock('../../../../app/processing/organisation/schema')
const schema = require('../../../../app/processing/organisation/schema')
jest.mock('../../../../app/processing/organisation/get-organisation-by-sbi')
const getOrganisationBySbi = require('../../../../app/processing/organisation/get-organisation-by-sbi')

const getOrganisation = require('../../../../app/processing/organisation/get-organisation')
const sbi = require('../../../mock-components/mock-sbi')

let organisationData

describe('get and transform organisation request information for building a statement object', () => {
  beforeEach(() => {
    const retrievedOrganisationData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))

    organisationData = retrievedOrganisationData

    schema.validate.mockReturnValue({ value: organisationData })
    getOrganisationBySbi.mockResolvedValue(retrievedOrganisationData)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getOrganisationBySbi when a sbi is given', async () => {
    await getOrganisation(sbi, mockTransaction)
    expect(getOrganisationBySbi).toHaveBeenCalled()
  })

  test('should call getOrganisationBySbi once when a sbi is given', async () => {
    await getOrganisation(sbi, mockTransaction)
    expect(getOrganisationBySbi).toHaveBeenCalledTimes(1)
  })

  test('should call getOrganisationBySbi with sbi when a sbi is given', async () => {
    await getOrganisation(sbi, mockTransaction)
    expect(getOrganisationBySbi).toHaveBeenCalledWith(sbi, mockTransaction)
  })

  test('should call schema.validate when a sbi is given', async () => {
    await getOrganisation(sbi, mockTransaction)
    expect(schema.validate).toHaveBeenCalled()
  })

  test('should call schema.validate once when a sbi is given', async () => {
    await getOrganisation(sbi, mockTransaction)
    expect(schema.validate).toHaveBeenCalledTimes(1)
  })

  test('should call schema.validate with organisationData and { abortEarly: false } when a sbi is given', async () => {
    await getOrganisation(sbi, mockTransaction)
    expect(schema.validate).toHaveBeenCalledWith(organisationData, { abortEarly: false })
  })

  test('should throw when getOrganisationBySbi throws', async () => {
    getOrganisationBySbi.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getOrganisation(sbi, mockTransaction)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getOrganisationBySbi throws Error', async () => {
    getOrganisationBySbi.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getOrganisation(sbi, mockTransaction)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error with "Database retrieval issue" when getOrganisationBySbi throws error with "Database retrieval issue"', async () => {
    getOrganisationBySbi.mockRejectedValue(new Error('Database retrieval issue'))

    const wrapper = async () => {
      await getOrganisation(sbi, mockTransaction)
    }

    expect(wrapper).rejects.toThrow(/^Database retrieval issue$/)
  })

  test('should not call schema.validate when getOrganisationBySbi throws', async () => {
    getOrganisationBySbi.mockRejectedValue(new Error('Database retrieval issue'))

    try { await getOrganisation(sbi, mockTransaction) } catch {}

    expect(schema.validate).not.toHaveBeenCalled()
  })

  test('should throw when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getOrganisation(sbi, mockTransaction)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when schema.validate returns with error key', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getOrganisation(sbi, mockTransaction)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw error which starts "Payment request with paymentRequestId:" when schema.validate returns with error key of "Joi validation issue"', async () => {
    schema.validate.mockReturnValue({ error: 'Not a valid object' })

    const wrapper = async () => {
      await getOrganisation(sbi, mockTransaction)
    }

    expect(wrapper).rejects.toThrow(/^Organisation with the sbi:/)
  })
})

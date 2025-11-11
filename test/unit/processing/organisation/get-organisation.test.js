const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = { commit: mockCommit, rollback: mockRollback }

jest.mock('../../../../app/data', () => ({
  sequelize: { transaction: jest.fn().mockResolvedValue({ ...mockTransaction }) }
}))

jest.mock('../../../../app/processing/organisation/schema')
const schema = require('../../../../app/processing/organisation/schema')
jest.mock('../../../../app/processing/organisation/get-organisation-by-sbi')
const getOrganisationBySbi = require('../../../../app/processing/organisation/get-organisation-by-sbi')

const getOrganisation = require('../../../../app/processing/organisation/get-organisation')
const sbi = require('../../../mock-components/mock-sbi')

let organisationData

describe('get and transform organisation request information for building a statement object', () => {
  beforeEach(() => {
    const retrievedOrganisationData = JSON.parse(
      JSON.stringify(require('../../../mock-objects/mock-organisation'))
    )
    organisationData = retrievedOrganisationData
    schema.validate.mockReturnValue({ value: organisationData })
    getOrganisationBySbi.mockResolvedValue(retrievedOrganisationData)
  })

  afterEach(() => jest.clearAllMocks())

  describe('successful flow', () => {
    test.each([
      ['should call getOrganisationBySbi', getOrganisationBySbi],
      ['should call schema.validate', schema.validate]
    ])('%s', async (_, fn) => {
      await getOrganisation(sbi, mockTransaction)
      expect(fn).toHaveBeenCalled()
      expect(fn).toHaveBeenCalledTimes(1)
    })

    test('should call getOrganisationBySbi with sbi', async () => {
      await getOrganisation(sbi, mockTransaction)
      expect(getOrganisationBySbi).toHaveBeenCalledWith(sbi, mockTransaction)
    })

    test('should call schema.validate with organisationData and { abortEarly: false }', async () => {
      await getOrganisation(sbi, mockTransaction)
      expect(schema.validate).toHaveBeenCalledWith(organisationData, { abortEarly: false })
    })
  })

  describe('getOrganisationBySbi errors', () => {
    beforeEach(() => {
      getOrganisationBySbi.mockRejectedValue(new Error('Database retrieval issue'))
    })

    test.each([
      ['should throw', undefined],
      ['should throw Error', Error],
      ['should throw error with "Database retrieval issue"', /^Database retrieval issue$/]
    ])('%s', async (_, expected) => {
      await expect(getOrganisation(sbi, mockTransaction)).rejects.toThrow(expected)
    })

    test('should not call schema.validate', async () => {
      try { await getOrganisation(sbi, mockTransaction) } catch {}
      expect(schema.validate).not.toHaveBeenCalled()
    })
  })

  describe('schema.validate errors', () => {
    beforeEach(() => {
      schema.validate.mockReturnValue({ error: 'Not a valid object' })
    })

    test.each([
      ['should throw', undefined],
      ['should throw Error', Error],
      ['should throw error starting with "Organisation with the sbi:"', /^Organisation with the sbi:/]
    ])('%s', async (_, expected) => {
      await expect(getOrganisation(sbi, mockTransaction)).rejects.toThrow(expected)
    })
  })
})

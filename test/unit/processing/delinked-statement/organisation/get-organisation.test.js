const getOrganisationBySbi = require('../../../../../app/processing/delinked-statement/organisation/get-organisation-by-sbi')
const validateOrganisation = require('../../../../../app/processing/delinked-statement/organisation/validate-organisation')
const getOrganisation = require('../../../../../app/processing/delinked-statement/organisation/get-organisation')

jest.mock('../../../../../app/processing/delinked-statement/organisation/get-organisation-by-sbi')
jest.mock('../../../../../app/processing/delinked-statement/organisation/validate-organisation')

describe('getOrganisation', () => {
  const sbi = '123456789'
  const organisation = { name: 'Test Organisation' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return validated organisation', async () => {
    getOrganisationBySbi.mockResolvedValue(organisation)
    validateOrganisation.mockReturnValue(organisation)

    const result = await getOrganisation(sbi)

    expect(getOrganisationBySbi).toHaveBeenCalledWith(sbi)
    expect(validateOrganisation).toHaveBeenCalledWith(organisation, sbi)
    expect(result).toEqual(organisation)
  })

  test('should throw an error if getOrganisationBySbi fails', async () => {
    getOrganisationBySbi.mockRejectedValue(new Error('Failed to get organisation'))

    await expect(getOrganisation(sbi)).rejects.toThrow('Failed to get organisation')
    expect(getOrganisationBySbi).toHaveBeenCalledWith(sbi)
    expect(validateOrganisation).not.toHaveBeenCalled()
  })

  test('should throw an error if validateOrganisation fails', async () => {
    getOrganisationBySbi.mockResolvedValue(organisation)
    validateOrganisation.mockImplementation(() => {
      throw new Error('Validation failed')
    })

    await expect(getOrganisation(sbi)).rejects.toThrow('Validation failed')
    expect(getOrganisationBySbi).toHaveBeenCalledWith(sbi)
    expect(validateOrganisation).toHaveBeenCalledWith(organisation, sbi)
  })
})

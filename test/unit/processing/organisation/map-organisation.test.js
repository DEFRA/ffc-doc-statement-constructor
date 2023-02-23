const mapOrganisation = require('../../../../app/processing/organisation/map-organisation')

let retrievedOrganisation
let mappedOrganisation

describe('map organisation information for building a statement object', () => {
  beforeEach(() => {
    retrievedOrganisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))

    mappedOrganisation = {
      line1: retrievedOrganisation.addressLine1,
      line2: retrievedOrganisation.addressLine2,
      line3: retrievedOrganisation.addressLine3,
      line4: retrievedOrganisation.city,
      line5: retrievedOrganisation.county,
      postcode: retrievedOrganisation.postcode,
      businessName: retrievedOrganisation.name,
      email: retrievedOrganisation.emailAddress,
      frn: retrievedOrganisation.frn,
      sbi: retrievedOrganisation.sbi
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return mappedOrganisation when a valid organisation is given', async () => {
    const result = mapOrganisation(retrievedOrganisation)
    expect(result).toStrictEqual(mappedOrganisation)
  })
})

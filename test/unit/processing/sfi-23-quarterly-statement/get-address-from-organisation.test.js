const getAddressFromOrganisation = require('../../../../app/processing/sfi-23-quarterly-statement/get-address-from-organisation')

describe('getAddressFromOrganisation', () => {
  test('should return the address object with correct properties', () => {
    const organisation = {
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      addressLine3: 'Building C',
      city: 'Cityville',
      county: 'Countyshire',
      postcode: '12345'
    }

    const expectedAddress = {
      line1: '123 Main St',
      line2: 'Apt 4B',
      line3: 'Building C',
      line4: 'Cityville',
      line5: 'Countyshire',
      postcode: '12345'
    }

    const result = getAddressFromOrganisation(organisation)

    expect(result).toEqual(expectedAddress)
  })
})

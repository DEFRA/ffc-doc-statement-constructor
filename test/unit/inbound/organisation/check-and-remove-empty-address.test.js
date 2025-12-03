const db = require('../../../../app/data')
const { checkAndRemoveEmptyAddress } = require('../../../../app/inbound/organisation/check-and-remove-empty-address')

jest.mock('../../../../app/data')

describe('checkAndRemoveEmptyAddress', () => {
  let transaction
  let organisationWithAddress
  let organisationNoAddress

  beforeEach(() => {
    transaction = {}
    organisationWithAddress = {
      sbi: '123',
      addressLine1: 'Line 1',
      addressLine2: null,
      addressLine3: null,
      city: 'City',
      county: null,
      postcode: 'PC1 1AA'
    }
    organisationNoAddress = {
      sbi: '456',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      city: null,
      county: null,
      postcode: null
    }
    jest.clearAllMocks()
  })

  test('returns false and does not delete if organisation has address', async () => {
    const result = await checkAndRemoveEmptyAddress(organisationWithAddress, transaction)
    expect(result).toBe(false)
    expect(db.organisation.findOne).not.toHaveBeenCalled()
    expect(db.organisation.destroy).not.toHaveBeenCalled()
  })

  test('deletes organisation if no address and exists in DB', async () => {
    db.organisation.findOne.mockResolvedValue(organisationNoAddress)
    db.organisation.destroy.mockResolvedValue(1)

    const result = await checkAndRemoveEmptyAddress(organisationNoAddress, transaction)

    expect(db.organisation.findOne).toHaveBeenCalledWith({
      where: { sbi: organisationNoAddress.sbi },
      transaction
    })
    expect(db.organisation.destroy).toHaveBeenCalledWith({
      where: { sbi: organisationNoAddress.sbi },
      transaction
    })
    expect(result).toBe(true)
  })

  test('does not delete organisation if no address and not in DB', async () => {
    db.organisation.findOne.mockResolvedValue(null)

    const result = await checkAndRemoveEmptyAddress(organisationNoAddress, transaction)

    expect(db.organisation.findOne).toHaveBeenCalledWith({
      where: { sbi: organisationNoAddress.sbi },
      transaction
    })
    expect(db.organisation.destroy).not.toHaveBeenCalled()
    expect(result).toBe(true)
  })
})

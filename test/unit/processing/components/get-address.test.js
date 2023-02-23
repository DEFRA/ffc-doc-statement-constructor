jest.mock('../../../../app/processing/organisation')
const getOrganisation = require('../../../../app/processing/organisation')

const getAddress = require('../../../../app/processing/components/get-address')

const mockOrganisation = require('../../../mock-objects/mock-organisation')
const mockTransaction = jest.fn()
const sbi = require('../../../mock-components/mock-sbi')

describe('get address', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getOrganisation.mockResolvedValue(mockOrganisation)
  })

  test('should return address line 1 as organisation address line 1', async () => {
    const address = await getAddress(sbi, mockTransaction)
    expect(address.line1).toBe(mockOrganisation.line1)
  })

  test('should return address line 2 as organisation address line 2', async () => {
    const address = await getAddress(sbi, mockTransaction)
    expect(address.line2).toBe(mockOrganisation.line2)
  })

  test('should return address line 3 as organisation address line 3', async () => {
    const address = await getAddress(sbi, mockTransaction)
    expect(address.line3).toBe(mockOrganisation.line3)
  })

  test('should return address line 4 as organisation address line 4', async () => {
    const address = await getAddress(sbi, mockTransaction)
    expect(address.line4).toBe(mockOrganisation.line4)
  })

  test('should return address line 5 as organisation address line 5', async () => {
    const address = await getAddress(sbi, mockTransaction)
    expect(address.line5).toBe(mockOrganisation.line5)
  })

  test('should return postcode as organisation postcode', async () => {
    const address = await getAddress(sbi, mockTransaction)
    expect(address.postcode).toBe(mockOrganisation.postcode)
  })

  test('should call get organisation with sbi and transaction', async () => {
    await getAddress(sbi, mockTransaction)
    expect(getOrganisation).toHaveBeenCalledWith(sbi, mockTransaction)
  })

  test('should call get organisation once', async () => {
    await getAddress(sbi, mockTransaction)
    expect(getOrganisation).toHaveBeenCalledTimes(1)
  })
})

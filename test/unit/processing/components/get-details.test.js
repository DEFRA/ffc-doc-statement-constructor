jest.mock('../../../../app/processing/organisation')
const getOrganisation = require('../../../../app/processing/organisation')

const getDetails = require('../../../../app/processing/components/get-details')

const mockOrganisation = require('../../../mock-objects/mock-organisation')
const mockTransaction = jest.fn()
const sbi = require('../../../mock-components/mock-sbi')

describe('get details', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getOrganisation.mockResolvedValue(mockOrganisation)
  })

  test('should return business name as organisation business name', async () => {
    const details = await getDetails(sbi, mockTransaction)
    expect(details.businessName).toBe(mockOrganisation.businessName)
  })

  test('should return email as organisation email', async () => {
    const details = await getDetails(sbi, mockTransaction)
    expect(details.email).toBe(mockOrganisation.email)
  })

  test('should return frn as organisation frn', async () => {
    const details = await getDetails(sbi, mockTransaction)
    expect(details.frn).toBe(mockOrganisation.frn)
  })

  test('should return sbi as organisation sbi', async () => {
    const details = await getDetails(sbi, mockTransaction)
    expect(details.sbi).toBe(mockOrganisation.sbi)
  })

  test('should call get organisation with sbi and transaction', async () => {
    await getDetails(sbi, mockTransaction)
    expect(getOrganisation).toHaveBeenCalledWith(sbi, mockTransaction)
  })

  test('should call get organisation once', async () => {
    await getDetails(sbi, mockTransaction)
    expect(getOrganisation).toHaveBeenCalledTimes(1)
  })

  test('should return frn as number', async () => {
    const details = await getDetails(sbi, mockTransaction)
    expect(typeof details.frn).toBe('number')
  })

  test('should return sbi as number', async () => {
    const details = await getDetails(sbi, mockTransaction)
    expect(typeof details.sbi).toBe('number')
  })

  test('should return frn as integer', async () => {
    const details = await getDetails(sbi, mockTransaction)
    expect(Number.isInteger(details.frn)).toBe(true)
  })

  test('should return sbi as integer', async () => {
    const details = await getDetails(sbi, mockTransaction)
    expect(Number.isInteger(details.sbi)).toBe(true)
  })
})

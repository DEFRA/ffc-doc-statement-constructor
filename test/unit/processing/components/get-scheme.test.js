jest.mock('../../../../app/processing/agreementNumber/get-agreement-number-by-claim-id')
const getAgreementNumberByClaimId = require('../../../../app/processing/agreementNumber/get-agreement-number-by-claim-id')

const getScheme = require('../../../../app/processing/components/get-scheme')

const mockYear = require('../../../mock-components/mock-marketing-year')
const mockFrequency = 'frequency'
const mockSfiAgreementNumber = require('../../../mock-components/mock-agreement-number').SFI
const mockSfiaAgreementNumber = require('../../../mock-components/mock-agreement-number').SFIA
const mockSfiaSourceSystem = 'SFIA'
const mockSfiSourceSystem = 'SFI'

describe('get scheme', () => {
  beforeEach(() => {
    getAgreementNumberByClaimId.mockResolvedValue({ agreementNumber: mockSfiaAgreementNumber })
  })

  describe('when sourceSystem is SFI', () => {
    test('should return name as Sustainable Farming Incentive', async () => {
      const scheme = await getScheme(mockYear, mockFrequency, mockSfiAgreementNumber, mockSfiSourceSystem)
      expect(scheme.name).toBe('Sustainable Farming Incentive')
    })

    test('should return short name as SFI', async () => {
      const scheme = await getScheme(mockYear, mockFrequency, mockSfiAgreementNumber, mockSfiSourceSystem)
      expect(scheme.shortName).toBe('SFI')
    })

    test('should return year as string of provided year', async () => {
      const scheme = await getScheme(mockYear, mockFrequency, mockSfiAgreementNumber, mockSfiSourceSystem)
      expect(scheme.year).toBe(String(mockYear))
    })

    test('should return provided frequency', async () => {
      const scheme = await getScheme(mockYear, mockFrequency, mockSfiAgreementNumber, mockSfiSourceSystem)
      expect(scheme.frequency).toBe(mockFrequency)
    })

    test('should return provided agreementNumber', async () => {
      const scheme = await getScheme(mockYear, mockFrequency, mockSfiAgreementNumber, mockSfiSourceSystem)
      expect(scheme.agreementNumber).toBe(mockSfiAgreementNumber)
    })
  })

  describe('when sourceSystem is SFIA', () => {
    test('should return name as Sustainable Farming Incentive 2023', async () => {
      const scheme = await getScheme(mockYear, mockFrequency, mockSfiaAgreementNumber, mockSfiaSourceSystem)
      expect(scheme.name).toBe('Sustainable Farming Incentive 2023')
    })

    test('should return short name as SFIA', async () => {
      const scheme = await getScheme(mockYear, mockFrequency, mockSfiaAgreementNumber, mockSfiaSourceSystem)
      expect(scheme.shortName).toBe('SFIA')
    })

    test('should return year as string of provided year', async () => {
      const scheme = await getScheme(mockYear, mockFrequency, mockSfiaAgreementNumber, mockSfiaSourceSystem)
      expect(scheme.year).toBe(String(mockYear))
    })

    test('should return provided frequency', async () => {
      const scheme = await getScheme(mockYear, mockFrequency, mockSfiaAgreementNumber, mockSfiaSourceSystem)
      expect(scheme.frequency).toBe(mockFrequency)
    })

    test('should return called getAgreementNumberByClaimId.agreementNumber as agreementNumber', async () => {
      const scheme = await getScheme(mockYear, mockFrequency, mockSfiaAgreementNumber, mockSfiSourceSystem)
      const calledGetAgreementNumberByClaimId = await getAgreementNumberByClaimId(mockSfiaAgreementNumber)
      expect(scheme.agreementNumber).toBe(calledGetAgreementNumberByClaimId.agreementNumber)
    })
  })
})

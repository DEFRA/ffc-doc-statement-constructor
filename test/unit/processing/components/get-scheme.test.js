const getScheme = require('../../../../app/processing/components/get-scheme')

const mockYear = require('../../../mock-components/mock-marketing-year')
const mockFrequency = 'frequency'
const mockAgreementNumber = require('../../../mock-components/mock-agreement-number').SFI

describe('get scheme', () => {
  test('should return name as Sustainable Farming Incentive', () => {
    const scheme = getScheme(mockYear, mockFrequency, mockAgreementNumber)
    expect(scheme.name).toBe('Sustainable Farming Incentive')
  })

  test('should return short name as SFI', () => {
    const scheme = getScheme(mockYear, mockFrequency, mockAgreementNumber)
    expect(scheme.shortName).toBe('SFI')
  })

  test('should return year as string', () => {
    const scheme = getScheme(mockYear, mockFrequency, mockAgreementNumber)
    expect(typeof scheme.year).toBe('string')
  })

  test('should return frequency as string', () => {
    const scheme = getScheme(mockYear, mockFrequency, mockAgreementNumber)
    expect(typeof scheme.frequency).toBe('string')
  })

  test('should return agreement number as string', () => {
    const scheme = getScheme(mockYear, mockFrequency, mockAgreementNumber)
    expect(typeof scheme.agreementNumber).toBe('string')
  })
})

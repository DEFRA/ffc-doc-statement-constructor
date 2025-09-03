const getD365 = require('../../../../app/processing/delinked-statement/d365')
const getOrganisation = require('../../../../app/processing/delinked-statement/organisation')
const getDelinkedCalculation = require('../../../../app/processing/delinked-statement/delinkedCalculation')
const saveDocument = require('../../../../app/processing/delinked-statement/save-document')
const getPreviousPaymentCountByCalculationId = require('../../../../app/processing/delinked-statement/get-previous-payment-count-by-calculation-id')
const getDocumentTypeByCode = require('../../../../app/processing/delinked-statement/get-document-type-by-code')
const getAddressFromOrganisation = require('../../../../app/processing/delinked-statement/get-address-from-organisation')
const { DELINKED } = require('../../../../app/constants/document-types')
const delinkedScheme = require('../../../../app/constants/delinked-scheme')

jest.mock('../../../../app/utility/processing-alerts', () => ({
  dataProcessingAlert: jest.fn()
}))
const { dataProcessingAlert } = require('../../../../app/utility/processing-alerts')

jest.mock('../../../../app/processing/delinked-statement/d365')
jest.mock('../../../../app/processing/delinked-statement/organisation')
jest.mock('../../../../app/processing/delinked-statement/delinkedCalculation')
jest.mock('../../../../app/processing/delinked-statement/save-document')
jest.mock('../../../../app/processing/delinked-statement/get-previous-payment-count-by-calculation-id')
jest.mock('../../../../app/processing/delinked-statement/get-document-type-by-code')
jest.mock('../../../../app/processing/delinked-statement/get-address-from-organisation')
jest.mock('../../../../app/constants/delinked-scheme', () => ({
  marketingYear: 2024,
  fullName: 'Delinked Payment Statement',
  shortName: 'DP',
  createScheme: jest.fn().mockReturnValue({
    fullName: 'Delinked Payment Statement',
    shortName: 'DP',
    year: 2024
  })
}))

const getDelinkedStatementByPaymentReference = require('../../../../app/processing/delinked-statement/get-delinked-statement-by-payment-reference')

describe('getDelinkedStatementByPaymentReference', () => {
  let consoleErrorSpy
  let consoleLogSpy

  beforeEach(() => {
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
    consoleLogSpy.mockRestore()
  })

  test('should handle missing D365 data', async () => {
    const paymentReference = 'paymentRef123'
    const excluded = false
    getD365.mockResolvedValue(null)

    await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow(`D365 data not found for payment reference: ${paymentReference}`)

    expect(dataProcessingAlert).not.toHaveBeenCalled()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('should call alert and throw when delinked calculation data is missing', async () => {
    const paymentReference = 'paymentRef123'
    const excluded = false
    const d365Mock = { calculationId: 'calc123', otherData: 'data' }
    getD365.mockResolvedValue(d365Mock)
    getDelinkedCalculation.mockResolvedValue(null)
    dataProcessingAlert.mockResolvedValueOnce()

    await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow(`Delinked calculation data not found for calculation ID: ${d365Mock.calculationId}`)

    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    expect(dataProcessingAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        process: 'getDelinkedCalculation',
        calculationId: d365Mock.calculationId,
        message: expect.stringContaining(`Delinked calculation data not found for calculation ID: ${d365Mock.calculationId}`)
      }),
      expect.anything()
    )
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('should log an error if dataProcessingAlert throws for delinked calculation missing', async () => {
    const paymentReference = 'paymentRef123'
    const excluded = false
    const d365Mock = { calculationId: 'calc123', otherData: 'data' }
    const alertError = new Error('alert failed')
    getD365.mockResolvedValue(d365Mock)
    getDelinkedCalculation.mockResolvedValue(null)
    dataProcessingAlert.mockRejectedValueOnce(alertError)

    await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow(`Delinked calculation data not found for calculation ID: ${d365Mock.calculationId}`)

    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Delinked calculation data not found for calculation ID: ${d365Mock.calculationId}`, alertError)
  })

  test('should call alert and throw when organisation data is missing', async () => {
    const paymentReference = 'paymentRef123'
    const excluded = false
    const d365Mock = { calculationId: 'calc123', otherData: 'data' }
    const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
    getD365.mockResolvedValue(d365Mock)
    getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
    getOrganisation.mockResolvedValue(null)
    dataProcessingAlert.mockResolvedValueOnce()

    await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow(`Organisation data not found for SBI: ${delinkedCalculationMock.sbi}`)

    expect(dataProcessingAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        process: 'getOrganisation',
        sbi: delinkedCalculationMock.sbi,
        message: expect.stringContaining(`Organisation data not found for SBI: ${delinkedCalculationMock.sbi}`)
      }),
      expect.anything()
    )
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('should call alert and throw when address data is missing', async () => {
    const paymentReference = 'paymentRef123'
    const excluded = false
    const d365Mock = { calculationId: 'calc123', otherData: 'data' }
    const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
    const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
    getD365.mockResolvedValue(d365Mock)
    getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
    getOrganisation.mockResolvedValue(organisationMock)
    getAddressFromOrganisation.mockReturnValue(null)
    dataProcessingAlert.mockResolvedValueOnce()

    await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow(`Address data not found for organisation: ${organisationMock.name}`)

    expect(dataProcessingAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        process: 'getAddressFromOrganisation',
        organisation: organisationMock.name,
        message: expect.stringContaining(`Address data not found for organisation: ${organisationMock.name}`)
      }),
      expect.anything()
    )
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('should call alert and throw when document type is invalid', async () => {
    const paymentReference = 'paymentRef123'
    const excluded = false
    const d365Mock = { calculationId: 'calc123', otherData: 'data' }
    const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
    const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
    const addressMock = { addressLine1: 'line1', addressLine2: 'line2' }
    const previousPaymentCountMock = 2
    const savedDocumentMock = { documentId: 'docId123' }

    getD365.mockResolvedValue(d365Mock)
    getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
    getOrganisation.mockResolvedValue(organisationMock)
    getAddressFromOrganisation.mockReturnValue(addressMock)
    getDocumentTypeByCode.mockResolvedValue(null)
    getPreviousPaymentCountByCalculationId.mockResolvedValue(previousPaymentCountMock)
    saveDocument.mockResolvedValue(savedDocumentMock)
    dataProcessingAlert.mockResolvedValueOnce()

    await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow(`Invalid document type code: ${DELINKED}`)

    expect(dataProcessingAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        process: 'getDocumentTypeByCode',
        type: DELINKED,
        message: expect.stringContaining(`Invalid document type code: ${DELINKED}`)
      }),
      expect.anything()
    )
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('should call alert and throw when previous payment count is invalid', async () => {
    const paymentReference = 'paymentRef123'
    const excluded = false
    const d365Mock = { calculationId: 'calc123', otherData: 'data' }
    const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
    const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
    const addressMock = { addressLine1: 'line1', addressLine2: 'line2' }
    const documentTypeMock = { documentTypeId: 'docType123' }
    const savedDocumentMock = { documentId: 'docId123' }

    getD365.mockResolvedValue(d365Mock)
    getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
    getOrganisation.mockResolvedValue(organisationMock)
    getAddressFromOrganisation.mockReturnValue(addressMock)
    getDocumentTypeByCode.mockResolvedValue(documentTypeMock)
    getPreviousPaymentCountByCalculationId.mockResolvedValue(null)
    saveDocument.mockResolvedValue(savedDocumentMock)
    dataProcessingAlert.mockResolvedValueOnce()

    await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow(`Invalid previous payment count for calculation ID: ${d365Mock.calculationId}`)

    expect(dataProcessingAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        process: 'getPreviousPaymentCountByCalculationId',
        calculationId: d365Mock.calculationId,
        message: expect.stringContaining(`Invalid previous payment count for calculation ID: ${d365Mock.calculationId}`)
      }),
      expect.anything()
    )
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('should call alert and throw when saved document is invalid', async () => {
    const paymentReference = 'paymentRef123'
    const excluded = false
    const d365Mock = { calculationId: 'calc123', otherData: 'data' }
    const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
    const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
    const addressMock = { addressLine1: 'line1', addressLine2: 'line2' }
    const documentTypeMock = { documentTypeId: 'docType123' }
    const previousPaymentCountMock = 2

    getD365.mockResolvedValue(d365Mock)
    getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
    getOrganisation.mockResolvedValue(organisationMock)
    getAddressFromOrganisation.mockReturnValue(addressMock)
    getDocumentTypeByCode.mockResolvedValue(documentTypeMock)
    getPreviousPaymentCountByCalculationId.mockResolvedValue(previousPaymentCountMock)
    saveDocument.mockResolvedValue(null)
    dataProcessingAlert.mockResolvedValueOnce()

    await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow(`Invalid saved document data for payment reference: ${paymentReference}`)

    expect(dataProcessingAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        process: 'saveDocument',
        paymentReference,
        message: expect.stringContaining(`Invalid saved document data for payment reference: ${paymentReference}`)
      }),
      expect.anything()
    )
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('should return delinked statement data successfully and log D365 load', async () => {
    const paymentReference = 'paymentRef123'
    const excluded = true
    const d365Mock = { calculationId: 'calc123', otherData: 'data', marketingYear: 2024, paymentReference }
    const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
    const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
    const addressMock = { addressLine1: 'line1', addressLine2: 'line2' }
    const documentTypeMock = { documentTypeId: 'docType123' }
    const previousPaymentCountMock = 2
    const savedDocumentMock = { documentId: 'docId123' }

    getD365.mockResolvedValue(d365Mock)
    getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
    getOrganisation.mockResolvedValue(organisationMock)
    getAddressFromOrganisation.mockReturnValue(addressMock)
    getDocumentTypeByCode.mockResolvedValue(documentTypeMock)
    getPreviousPaymentCountByCalculationId.mockResolvedValue(previousPaymentCountMock)
    saveDocument.mockResolvedValue(savedDocumentMock)

    const result = await getDelinkedStatementByPaymentReference(paymentReference, excluded)

    expect(result).toEqual({
      address: addressMock,
      businessName: organisationMock.name,
      email: organisationMock.emailAddress,
      frn: organisationMock.frn,
      sbi: organisationMock.sbi,
      ...delinkedCalculationMock,
      ...d365Mock,
      scheme: {
        name: 'Delinked Payment Statement',
        shortName: 'DP',
        year: 2024
      },
      previousPaymentCount: previousPaymentCountMock,
      documentReference: savedDocumentMock.documentId,
      excludedFromNotify: excluded
    })
    expect(delinkedScheme.createScheme).toHaveBeenCalledWith(d365Mock.marketingYear)

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'D365 data loaded:',
      expect.stringContaining(`"paymentReference": "${paymentReference}"`)
    )
  })

  test('should use DELINKED document type code', async () => {
    const paymentReference = 'paymentRef123'
    const excluded = false
    const d365Mock = { calculationId: 'calc123', otherData: 'data', marketingYear: 2024 }
    const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
    const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
    const addressMock = { addressLine1: 'line1', addressLine2: 'line2' }
    const documentTypeMock = { documentTypeId: 'docType123' }
    const previousPaymentCountMock = 2
    const savedDocumentMock = { documentId: 'docId123' }

    getD365.mockResolvedValue(d365Mock)
    getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
    getOrganisation.mockResolvedValue(organisationMock)
    getAddressFromOrganisation.mockReturnValue(addressMock)
    getDocumentTypeByCode.mockResolvedValue(documentTypeMock)
    getPreviousPaymentCountByCalculationId.mockResolvedValue(previousPaymentCountMock)
    saveDocument.mockResolvedValue(savedDocumentMock)

    await getDelinkedStatementByPaymentReference(paymentReference, excluded)

    expect(getDocumentTypeByCode).toHaveBeenCalledWith(DELINKED)
  })
})

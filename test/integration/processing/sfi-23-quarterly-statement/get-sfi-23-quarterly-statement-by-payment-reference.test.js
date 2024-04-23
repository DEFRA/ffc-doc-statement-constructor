jest.mock('../../../../app/processing/sfi-23-quarterly-statement/dax')
const getDax = require('../../../../app/processing/sfi-23-quarterly-statement/dax')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/organisation')
const getOrganisation = require('../../../../app/processing/sfi-23-quarterly-statement/organisation')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/total')
const getTotal = require('../../../../app/processing/sfi-23-quarterly-statement/total')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/scheme')
const getScheme = require('../../../../app/processing/sfi-23-quarterly-statement/scheme')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/action-groups')
const getActionGroups = require('../../../../app/processing/sfi-23-quarterly-statement/action-groups')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/save-document')
const saveDocument = require('../../../../app/processing/sfi-23-quarterly-statement/save-document')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/get-previous-payment-count-by-document-id')
const getPreviousPaymentCountByCalculationId = require('../../../../app/processing/sfi-23-quarterly-statement/get-previous-payment-count-by-document-id')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/get-document-type-by-code')
const getDocumentTypeByCode = require('../../../../app/processing/sfi-23-quarterly-statement/get-document-type-by-code')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/get-address-from-organisation')
const getAddressFromOrganisation = require('../../../../app/processing/sfi-23-quarterly-statement/get-address-from-organisation')

const getSfi23QuarterlyStatementByPaymentReference = require('../../../../app/processing/sfi-23-quarterly-statement/get-sfi-23-quarterly-statement-by-payment-reference')

const paymentReference = 'PY12345670'

describe('get Sfi23 Quarterly Statement by Payment reference', () => {
  beforeEach(async () => {
    const dax = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-dax')))
    const organisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))
    const total = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-total')))
    const scheme = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-scheme')))
    const actionGroups = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-action-groups')))
    const savedDocument = { documentId: 2 }
    const previousPaymentCount = 1
    const documentType = { documentTypeId: 1 }
    const address = {
      line1: '123 Main St',
      line2: 'Apt 4B',
      line3: 'Building C',
      line4: 'Cityville',
      line5: 'Countyshire',
      postcode: '12345'
    }

    getDax.mockResolvedValue(dax)
    getOrganisation.mockResolvedValue(organisation)
    getTotal.mockResolvedValue(total)
    getScheme.mockResolvedValue(scheme)
    getActionGroups.mockResolvedValue(actionGroups)
    saveDocument.mockResolvedValue(savedDocument)
    getPreviousPaymentCountByCalculationId.mockResolvedValue(previousPaymentCount)
    getDocumentTypeByCode.mockResolvedValue(documentType)
    getAddressFromOrganisation.mockResolvedValue(address)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getDax', async () => {
    await getSfi23QuarterlyStatementByPaymentReference(paymentReference)
    expect(getDax).toHaveBeenCalled()
  })

  test('should call getOrganisation', async () => {
    await getSfi23QuarterlyStatementByPaymentReference(paymentReference)
    expect(getOrganisation).toHaveBeenCalled()
  })

  test('should call getTotal', async () => {
    await getSfi23QuarterlyStatementByPaymentReference(paymentReference)
    expect(getTotal).toHaveBeenCalled()
  })

  test('should call getScheme', async () => {
    await getSfi23QuarterlyStatementByPaymentReference(paymentReference)
    expect(getScheme).toHaveBeenCalled()
  })

  test('should call getActionGroups', async () => {
    await getSfi23QuarterlyStatementByPaymentReference(paymentReference)
    expect(getActionGroups).toHaveBeenCalled()
  })

  test('should call saveDocument', async () => {
    await getSfi23QuarterlyStatementByPaymentReference(paymentReference)
    expect(saveDocument).toHaveBeenCalled()
  })

  test('should call getPreviousPaymentCountByCalculationId', async () => {
    await getSfi23QuarterlyStatementByPaymentReference(paymentReference)
    expect(getPreviousPaymentCountByCalculationId).toHaveBeenCalled()
  })

  test('should call getDocumentTypeByCode', async () => {
    await getSfi23QuarterlyStatementByPaymentReference(paymentReference)
    expect(getDocumentTypeByCode).toHaveBeenCalled()
  })

  test('should call getAddressFromOrganisation', async () => {
    await getSfi23QuarterlyStatementByPaymentReference(paymentReference)
    expect(getAddressFromOrganisation).toHaveBeenCalled()
  })
})

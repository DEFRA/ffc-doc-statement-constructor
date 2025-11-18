jest.mock('../../../../app/processing/sfi-23-quarterly-statement/organisation')
const getOrganisation = require('../../../../app/processing/sfi-23-quarterly-statement/organisation')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/total')
const getTotal = require('../../../../app/processing/sfi-23-quarterly-statement/total')

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

const getSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/get-sfi-23-quarterly-statement')

const paymentReference = 'PY12345670'

describe('get Sfi23 Quarterly Statement by Payment reference', () => {
  beforeEach(async () => {
    const organisation = structuredClone(require('../../../mock-objects/mock-organisation'))
    const total = structuredClone(require('../../../mock-objects/mock-total'))
    const actionGroups = structuredClone(require('../../../mock-objects/mock-action-groups'))
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

    getOrganisation.mockResolvedValue(organisation)
    getTotal.mockResolvedValue(total)
    getActionGroups.mockResolvedValue(actionGroups)
    saveDocument.mockResolvedValue(savedDocument)
    getPreviousPaymentCountByCalculationId.mockResolvedValue(previousPaymentCount)
    getDocumentTypeByCode.mockResolvedValue(documentType)
    getAddressFromOrganisation.mockResolvedValue(address)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockedFunctions = [
    ['getOrganisation', getOrganisation],
    ['getTotal', getTotal],
    ['getActionGroups', getActionGroups],
    ['saveDocument', saveDocument],
    ['getPreviousPaymentCountByCalculationId', getPreviousPaymentCountByCalculationId],
    ['getDocumentTypeByCode', getDocumentTypeByCode],
    ['getAddressFromOrganisation', getAddressFromOrganisation]
  ]

  test.each(mockedFunctions)(
    'should call %s',
    async (_name, fn) => {
      await getSfi23QuarterlyStatement(paymentReference)
      expect(fn).toHaveBeenCalled()
    }
  )
})

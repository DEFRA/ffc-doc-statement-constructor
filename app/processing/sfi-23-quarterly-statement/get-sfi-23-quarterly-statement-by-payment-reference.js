const getDax = require('./dax')
const getOrganisation = require('./organisation')
const getTotal = require('./total')
const getActionGroups = require('./action-groups')
const saveDocument = require('./save-document')
const getPreviousPaymentCountByCalculationId = require('./get-previous-payment-count-by-document-id')
const getDocumentTypeByCode = require('./get-document-type-by-code')
const getAddressFromOrganisation = require('./get-address-from-organisation')

const { SFI23QUARTERLYSTATEMENT } = require('../../constants/document-types')

const getSfi23QuarterlyStatementByPaymentReference = async (calculationId, excluded) => {
  const sfi23MarketingYear = '2023'
  const sfiFullName = 'Sustainable Farming Incentive'
  const sfi23ShortName = 'SFI'
  const sfi23Frequency = 'Quarterly'
  const dax = await getDax(calculationId)
  const total = await getTotal(calculationId)
  const organisation = await getOrganisation(total.sbi)
  const address = getAddressFromOrganisation(organisation)
  const actionGroups = await getActionGroups(total.calculationReference)
  const { documentTypeId } = await getDocumentTypeByCode(SFI23QUARTERLYSTATEMENT)
  const previousPaymentCount = await getPreviousPaymentCountByCalculationId(dax.calculationId)
  const scheme = {
    name: sfiFullName,
    shortName: sfi23ShortName,
    year: sfi23MarketingYear,
    frequency: sfi23Frequency,
    agreementNumber: total.agreementNumber.toString()
  }

  const document = {
    documentTypeId,
    documentSourceReference: dax.paymentReference
  }

  const { documentId } = await saveDocument(document)

  return {
    address,
    businessName: organisation.name,
    email: organisation.emailAddress,
    frn: organisation.frn,
    sbi: organisation.sbi,
    ...dax,
    ...total,
    scheme,
    actionGroups,
    previousPaymentCount,
    documentReference: documentId,
    excludedFromNotify: excluded
  }
}

module.exports = getSfi23QuarterlyStatementByPaymentReference

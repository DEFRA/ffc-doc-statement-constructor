const util = require('util')
const getDax = require('./dax')
const getOrganisation = require('./organisation')
const getTotal = require('./total')
const getActionGroups = require('./action-groups')
const saveDocument = require('./save-document')
const getPreviousPaymentCountByCalculationId = require('./get-previous-payment-count-by-document-id')
const getDocumentTypeByCode = require('./get-document-type-by-code')
const getAddressFromOrganisation = require('./get-address-from-organisation')

const { SFI23QUARTERLYSTATEMENT } = require('../../constants/document-types')
const { processingConfig } = require('../../config')
const { getAmountFromSettlements } = require('./value-override/get-amount-from-settlements')

const getSfi23QuarterlyStatementByPaymentReference = async (paymentReference, excluded) => {
  const sfi23MarketingYear = '2023'
  const sfiFullName = 'Sustainable Farming Incentive'
  const sfi23ShortName = 'SFI'
  const sfi23Frequency = 'Quarterly'
  const dax = await getDax(paymentReference)
  if (processingConfig.sfi23OverrideDWHValue) {
    dax.paymentAmount = await getAmountFromSettlements(paymentReference)
    console.log('DAX payment amount:', util.inspect(dax.paymentAmount, false, null, true))
  }
  const total = await getTotal(dax.calculationId)
  if (processingConfig.sfi23OverrideDWHValue) {
    total.totalAdditionalPayments = dax.paymentAmount
    total.totalActionPayments = dax.paymentAmount
    total.totalPayments = dax.paymentAmount
  }
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
    documentSourceReference: paymentReference
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

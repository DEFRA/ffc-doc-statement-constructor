const getDax = require('./dax')
const getOrganisation = require('./organisation')
const getTotal = require('./total')
const getScheme = require('./scheme')
const getActionGroups = require('./action-groups')

const getSfi23QuarterlyStatementByPaymentReference = async (PaymentReference) => {
  const dax = await getDax(PaymentReference)
  const total = await getTotal(dax.calculationId)
  const organisation = await getOrganisation(total.sbi)
  const scheme = await getScheme(total.schemeCode)
  const actionGroups = await getActionGroups(total.calculationReference)
  return {
    ...organisation,
    ...dax,
    ...total,
    ...scheme,
    actionGroups
  }
}

module.exports = getSfi23QuarterlyStatementByPaymentReference

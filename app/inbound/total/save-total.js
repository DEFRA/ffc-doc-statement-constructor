const { totals } = require('../../data')

const saveTotal = async (total, transaction) => {
  try {
    const transformedTotal = {
      calculationId: total.calculationReference,
      claimId: total.claimReference,
      sbi: total.sbi,
      frn: total.frn,
      agreementNumber: total.agreementNumber,
      schemeType: total.schemeType,
      calculationDate: total.calculationDate,
      invoiceNumber: total.invoiceNumber,
      agreementStart: total.agreementStart,
      agreementEnd: total.agreementEnd,
      totalAdditionalPayments: total.totalAdditionalPayments,
      totalActionPayments: total.totalActionPayments,
      totalPayments: total.totalPayments,
      updated: total.updated,
      datePublished: total.datePublished
    }

    await totals(transaction).insert(transformedTotal)
  } catch (error) {
    throw new Error(`Error saving total with Calculation Id ${total.calculationReference}: ${error.message}`)
  }
}

module.exports = saveTotal

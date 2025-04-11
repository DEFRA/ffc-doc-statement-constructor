const db = require('../../data')

const saveDelinked = async (transformedDelinked, transaction) => {
  const delinkedRecord = {
    calculationId: transformedDelinked.calculationId,
    applicationId: transformedDelinked.applicationId,
    sbi: transformedDelinked.sbi,
    frn: transformedDelinked.frn,
    paymentBand1: transformedDelinked.paymentBand1,
    paymentBand2: transformedDelinked.paymentBand2,
    paymentBand3: transformedDelinked.paymentBand3,
    paymentBand4: transformedDelinked.paymentBand4,
    percentageReduction1: transformedDelinked.percentageReduction1,
    percentageReduction2: transformedDelinked.percentageReduction2,
    percentageReduction3: transformedDelinked.percentageReduction3,
    percentageReduction4: transformedDelinked.percentageReduction4,
    paymentAmountCalculated: transformedDelinked.paymentAmountCalculated,
    progressiveReductions1: transformedDelinked.progressiveReductions1,
    progressiveReductions2: transformedDelinked.progressiveReductions2,
    progressiveReductions3: transformedDelinked.progressiveReductions3,
    progressiveReductions4: transformedDelinked.progressiveReductions4,
    referenceAmount: transformedDelinked.referenceAmount,
    totalProgressiveReduction: transformedDelinked.totalProgressiveReduction,
    totalDelinkedPayment: transformedDelinked.totalDelinkedPayment,
    datePublished: transformedDelinked.datePublished,
    updated: transformedDelinked.updated || new Date()
  }

  return db.delinkedCalculation.create(delinkedRecord, {
    transaction,
    raw: true
  })
}

module.exports = saveDelinked

const getFundings = require('../funding')
const getInvoiceLine = require('../invoice-line')
const { convertToPounds } = require('../../utility')

const getDetailedFunding = async (calculationId, paymentRequestId, transaction) => {
  const fundings = await getFundings(calculationId, transaction)
  const detailedFundings = []
  const rawDetailedFundings = []

  for (const funding of fundings) {
    const invoiceLine = await getInvoiceLine(funding.fundingCode, paymentRequestId, transaction)
    rawDetailedFundings.push({ area: funding.area, ...invoiceLine })

    const { annualValue, quarterlyValue, quarterlyReduction, quarterlyPayment, reductions } = invoiceLine

    const invoiceLineInPounds = {
      annualValue: convertToPounds(annualValue),
      quarterlyValue: convertToPounds(quarterlyValue),
      quarterlyReduction: convertToPounds(quarterlyReduction),
      quarterlyPayment: convertToPounds(quarterlyPayment),
      reductions: reductions.map(reduction => ({
        ...reduction,
        value: convertToPounds(reduction.value)
      }))
    }

    const detailedFunding = {
      area: funding.area,
      level: funding.level,
      name: funding.name,
      rate: funding.rate,
      ...invoiceLineInPounds
    }

    detailedFundings.push(detailedFunding)
  }

  const total = {
    area: rawDetailedFundings.reduce((x, y) => x + Number(y.area), 0).toFixed(4),
    level: '',
    name: 'Total',
    rate: '',
    annualValue: convertToPounds(rawDetailedFundings.reduce((x, y) => x + y.annualValue, 0)),
    quarterlyValue: convertToPounds(rawDetailedFundings.reduce((x, y) => x + y.quarterlyValue, 0)),
    quarterlyReduction: convertToPounds(rawDetailedFundings.reduce((x, y) => x + y.quarterlyReduction, 0)),
    quarterlyPayment: convertToPounds(rawDetailedFundings.reduce((x, y) => x + y.quarterlyPayment, 0))
  }

  detailedFundings.push(total)

  return detailedFundings
}

module.exports = getDetailedFunding

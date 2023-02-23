const mapCalculation = (calculation) => {
  return {
    calculationId: calculation.calculationId,
    sbi: calculation.sbi,
    calculated: calculation.calculationDate,
    invoiceNumber: calculation.invoiceNumber,
    paymentRequestId: calculation.paymentRequestId
  }
}

module.exports = mapCalculation

const reverseEngineerInvoiceNumber = (invoiceNumber) => {
  const firstPart = 'SFI0'
  const secondPart = invoiceNumber.slice(1, 8)
  return firstPart.concat(secondPart)
}

module.exports = reverseEngineerInvoiceNumber

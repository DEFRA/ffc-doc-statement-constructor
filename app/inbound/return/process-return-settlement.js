const db = require('../../data')
const saveSettlement = require('./save-settlement')
const saveSchedule = require('./save-schedule')
const getSettlementByInvoiceNumberAndValue = require('./get-settlement-by-invoice-number-and-value')
const config = require('../../config').processingConfig
const hourInMs = 36e5

const processReturnSettlement = async (settlement) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingSettlement = await getSettlementByInvoiceNumberAndValue(settlement.invoiceNumber, settlement.value, transaction)
    if (existingSettlement) {
      console.info(`Duplicate settlement received, skipping ${existingSettlement.reference}`)

      const maxProcessingRequestAgeHours = config.maxProcessingRequestAgeHours
      const receivedDate = new Date(existingSettlement.received)
      const currentDate = new Date()
      const hoursDifference = Math.abs(currentDate - receivedDate) / hourInMs

      if (hoursDifference > maxProcessingRequestAgeHours) {
        console.error(`Settlement ${existingSettlement.invoiceNumber} was received more than ${maxProcessingRequestAgeHours} hours ago.`)
        throw new Error(`Settlement ${existingSettlement.invoiceNumber} was received more than ${maxProcessingRequestAgeHours} hours ago.`)
      }

      await transaction.rollback()
    } else {
      const savedSettlement = await saveSettlement(settlement, transaction)
      await saveSchedule(savedSettlement, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processReturnSettlement

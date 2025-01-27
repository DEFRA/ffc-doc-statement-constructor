const db = require('../../data')
const saveSettlement = require('./save-settlement')
const saveSchedule = require('./save-schedule')
const getSettlementByInvoiceNumberAndValue = require('./get-settlement-by-invoice-number-and-value')
const config = require('../../config').processingConfig

const processReturnSettlement = async (settlement) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingSettlement = await getSettlementByInvoiceNumberAndValue(settlement.invoiceNumber, settlement.value, transaction)
    if (existingSettlement) {
      console.info(`Duplicate settlement received, skipping ${existingSettlement.reference}`)

      const hoursLimit = config.hoursLimit
      const receivedDate = new Date(existingSettlement.received)
      const currentDate = new Date()
      const hoursDifference = Math.abs(currentDate - receivedDate) / 36e5

      if (hoursDifference > hoursLimit) {
        console.error(`Settlement ${existingSettlement.invoiceNumber} was received more than ${hoursLimit} hours ago.`)
        throw new Error(`Settlement ${existingSettlement.invoiceNumber} was received more than ${hoursLimit} hours ago.`)
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

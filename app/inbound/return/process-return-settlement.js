const db = require('../../data')
const saveSettlement = require('./save-settlement')
const saveSchedule = require('./save-schedule')
const getSettlementByInvoiceNumberAndValue = require('./get-settlement-by-invoice-number-and-value')

const processReturnSettlement = async (settlement) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingSettlement = await getSettlementByInvoiceNumberAndValue(settlement.invoiceNumber, settlement.value, transaction)
    if (existingSettlement) {
      console.info(`Duplicate settlement received, skipping ${existingSettlement.reference}`)
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

const updateD365StartPublishByD365Id = require('./update-d365-start-publish-by-d365-id')

const updateD365ForStartPublish = async (d365, transaction) => {
  const started = new Date()
  for (const item of d365) {
    try {
      await updateD365StartPublishByD365Id(item.d365Id, started, transaction)
    } catch (err) {
      console.error(`Could not start delinked statement for d365 payment: ${item.paymentReference}`)
      throw new Error(`Could not start delinked statement for d365 payment: ${item.paymentReference}`)
    }
  }
}

module.exports = updateD365ForStartPublish

const updateDaxStartPublishByDaxId = require('./update-dax-start-publish-by-dax-id')

const updateDaxsForStartPublish = async (daxs, transaction) => {
  const started = new Date()
  for (const dax of daxs) {
    try {
      await updateDaxStartPublishByDaxId(dax.daxId, started, transaction)
    } catch (err) {
      console.error(`Could not start sfi-23 quarterly statement for dax payment: ${dax.paymentReference}`)
      throw new Error(`Could not start sfi-23 quarterly statement for dax payment: ${dax.paymentReference}`)
    }
  }
}

module.exports = updateDaxsForStartPublish

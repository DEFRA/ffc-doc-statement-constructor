const { dataProcessingAlert } = require('ffc-alerting-utils')
const updateD365StartPublishByD365Id = require('./update-d365-start-publish-by-d365-id')
const { DATA_PROCESSING_ERROR } = require('../../../app/constants/alerts')

const updateD365ForStartPublish = async (d365, transaction) => {
  const started = new Date()
  for (const item of d365) {
    try {
      await updateD365StartPublishByD365Id(item.d365Id, started, transaction)
    } catch (err) {
      try {
        await dataProcessingAlert({
          process: 'updateD365ForStartPublish',
          paymentReference: item?.paymentReference,
          error: err,
          message: `Could not start delinked statement for d365 payment: ${item.paymentReference}`
        }, DATA_PROCESSING_ERROR)
      } catch (error) {
        console.error(`Could not start delinked statement for d365 payment: ${item.paymentReference}`,
          { originalError: err, alertError: error }
        )
      }
      throw new Error(`Could not start delinked statement for d365 payment: ${item.paymentReference}`,
        { cause: err }
      )
    }
  }
}

module.exports = updateD365ForStartPublish

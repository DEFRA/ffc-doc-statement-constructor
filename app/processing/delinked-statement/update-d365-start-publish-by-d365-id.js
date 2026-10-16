const { d365 } = require('../../database')

const updateD365StartPublishByD365Id = async (d365Id, started, transaction) => {
  await d365(transaction)
    .where({ d365Id })
    .update({ startPublish: started, lastProcessAttempt: started })
}

module.exports = updateD365StartPublishByD365Id

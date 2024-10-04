const db = require('../../data')

const updateD365StartPublishByD365Id = async (d365Id, started, transaction) => {
  await db.d365.update({ startPublish: started, lastProcessAttempt: started }, {
    transaction,
    where: {
      d365Id
    }
  })
}

module.exports = updateD365StartPublishByD365Id

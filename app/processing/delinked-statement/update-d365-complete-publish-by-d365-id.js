const db = require('../../data')

const updateD365CompletePublishByD365Id = async (d365Id) => {
  await db.d365.update({ completePublish: new Date() }, {
    where: {
      d365Id
    }
  })
}

module.exports = updateD365CompletePublishByD365Id

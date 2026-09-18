const { d365 } = require('../../data')

const updateD365CompletePublishByD365Id = async (d365Id) => {
  await d365()
    .where({ d365Id })
    .update({ completePublish: new Date() })
}

module.exports = updateD365CompletePublishByD365Id

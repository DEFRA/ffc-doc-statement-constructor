const { dax } = require('../../data')

const updateDaxCompletePublishByDaxId = async (daxId) => {
  await dax()
    .where({ daxId })
    .update({ completePublish: new Date() })
}

module.exports = updateDaxCompletePublishByDaxId

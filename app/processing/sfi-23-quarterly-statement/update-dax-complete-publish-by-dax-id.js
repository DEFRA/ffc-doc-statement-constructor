const { dax } = require('../../database')

const updateDaxCompletePublishByDaxId = async (daxId) => {
  await dax()
    .where({ daxId })
    .update({ completePublish: new Date() })
}

module.exports = updateDaxCompletePublishByDaxId

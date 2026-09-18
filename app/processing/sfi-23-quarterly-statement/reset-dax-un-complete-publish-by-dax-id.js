const { dax } = require('../../data')

const resetDaxUnCompletePublishByDaxId = async (daxId) => {
  await dax()
    .where({ daxId })
    .whereNull('completePublish')
    .update({ startPublish: null })
}

module.exports = resetDaxUnCompletePublishByDaxId

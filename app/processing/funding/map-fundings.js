const mapFundings = (rawFundings) => {
  const fundings = rawFundings.map(rawFunding => ({
    area: rawFunding.areaClaimed,
    fundingCode: rawFunding.fundingCode,
    level: getLevel(rawFunding.fundingOptions.name),
    name: getName(rawFunding.fundingOptions.name),
    rate: rawFunding.rate
  }))

  return fundings
}

const getName = (rawName) => {
  const nameLevel = rawName.split(':')
  return nameLevel[0].trim()
}

const getLevel = (rawName) => {
  const nameLevel = rawName.split(':')
  return nameLevel[1] ? nameLevel[1].trim() : ''
}

module.exports = mapFundings

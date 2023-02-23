const {
  ARABLE_SOIL_INTRODUCTORY,
  COMMON_LAND_ADDITIONAL,
  HEDGEROW,
  MOORLAND_ADDITIONAL,
  MOORLAND_INTRODUCTORY
} = require('../../app/constants/funding-codes')

const {
  GROSS_VALUE,
  OVER_DECLARATION_PENALTY
} = require('../../app/constants/descriptions')

const invoiceLineArableSoilIntroductoryGross = {
  description: GROSS_VALUE,
  fundingCode: ARABLE_SOIL_INTRODUCTORY,
  value: 82321
}

const invoiceLineArableSoilIntroductoryOverDeclaration = {
  description: OVER_DECLARATION_PENALTY,
  fundingCode: ARABLE_SOIL_INTRODUCTORY,
  value: -3209
}

const invoiceLineCommonLandAdditionalGross = {
  description: GROSS_VALUE,
  fundingCode: COMMON_LAND_ADDITIONAL,
  value: 1902
}

const invoiceLineHedgerowGross = {
  description: GROSS_VALUE,
  fundingCode: HEDGEROW,
  value: 6
}

const invoiceLineMoorlandAdditionalGross = {
  description: GROSS_VALUE,
  fundingCode: MOORLAND_ADDITIONAL,
  value: 3298
}

const invoiceLineMoorlandIntroductoryGross = {
  description: GROSS_VALUE,
  fundingCode: MOORLAND_INTRODUCTORY,
  value: 20000
}

module.exports = [
  invoiceLineMoorlandAdditionalGross,
  invoiceLineArableSoilIntroductoryGross,
  invoiceLineArableSoilIntroductoryOverDeclaration,
  invoiceLineCommonLandAdditionalGross,
  invoiceLineHedgerowGross,
  invoiceLineMoorlandIntroductoryGross
]

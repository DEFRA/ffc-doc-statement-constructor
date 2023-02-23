const {
  ARABLE_SOIL_INTRODUCTORY,
  COMMON_LAND_ADDITIONAL,
  HEDGEROW,
  MOORLAND_ADDITIONAL,
  MOORLAND_INTRODUCTORY
} = require('../../app/constants/funding-code-names')

const {
  ARABLE_SOIL_INTRODUCTORY: ARABLE_SOIL_INTRODUCTORY_CODE,
  COMMON_LAND_ADDITIONAL: COMMON_LAND_ADDITIONAL_CODE,
  HEDGEROW: HEDGEROW_CODE,
  MOORLAND_ADDITIONAL: MOORLAND_ADDITIONAL_CODE,
  MOORLAND_INTRODUCTORY: MOORLAND_INTRODUCTORY_CODE
} = require('../../app/constants/funding-codes')

const fundingOptionArableSoilIntroductory = {
  fundingCode: ARABLE_SOIL_INTRODUCTORY_CODE,
  name: ARABLE_SOIL_INTRODUCTORY
}

const fundingOptionCommonLandAdditional = {
  fundingCode: COMMON_LAND_ADDITIONAL_CODE,
  name: COMMON_LAND_ADDITIONAL
}

const fundingOptionHedgerow = {
  fundingCode: HEDGEROW_CODE,
  name: HEDGEROW
}

const fundingOptionMoorlandAdditional = {
  fundingCode: MOORLAND_ADDITIONAL_CODE,
  name: MOORLAND_ADDITIONAL
}

const fundingOptionMoorlandIntroductory = {
  fundingCode: MOORLAND_INTRODUCTORY_CODE,
  name: MOORLAND_INTRODUCTORY
}

module.exports = [
  fundingOptionMoorlandAdditional,
  fundingOptionArableSoilIntroductory,
  fundingOptionCommonLandAdditional,
  fundingOptionHedgerow,
  fundingOptionMoorlandIntroductory
]

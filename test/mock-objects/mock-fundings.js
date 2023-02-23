
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

const fundingArableSoilIntroductory = {
  fundingCode: ARABLE_SOIL_INTRODUCTORY_CODE,
  areaClaimed: 5.00,
  rate: 28.55,
  fundingOptions: { name: ARABLE_SOIL_INTRODUCTORY }
}

const fundingCommonLandAdditional = {
  fundingCode: COMMON_LAND_ADDITIONAL_CODE,
  areaClaimed: 8.09,
  rate: 11.93,
  fundingOptions: { name: COMMON_LAND_ADDITIONAL }
}

const fundingHedgerow = {
  fundingCode: HEDGEROW_CODE,
  areaClaimed: 425.4509,
  rate: 8.17,
  fundingOptions: { name: HEDGEROW }
}

const fundingMoorlandAdditional = {
  fundingCode: MOORLAND_ADDITIONAL_CODE,
  areaClaimed: 6402.7291,
  rate: 4.22,
  fundingOptions: { name: MOORLAND_ADDITIONAL }
}

const fundingMoorlandIntroductory = {
  fundingCode: MOORLAND_INTRODUCTORY_CODE,
  areaClaimed: 2.1,
  rate: 2.80,
  fundingOptions: { name: MOORLAND_INTRODUCTORY }
}

module.exports = [
  fundingMoorlandAdditional,
  fundingArableSoilIntroductory,
  fundingCommonLandAdditional,
  fundingHedgerow,
  fundingMoorlandIntroductory
]

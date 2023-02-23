const {
  LNR: LNR_ID,
  LUMP_SUMS: LUMP_SUMS_ID,
  SFI: SFI_ID,
  SFI_PILOT: SFI_PILOT_ID,
  VET_VISITS: VET_VISITS_ID
} = require('./scheme-ids')

const {
  LNR,
  LUMP_SUMS,
  SFI,
  SFI_PILOT,
  VET_VISITS
} = require('./scheme-names').SHORT_NAMES

module.exports = [{
  schemeId: LNR_ID,
  name: LNR
},
{
  schemeId: LUMP_SUMS_ID,
  name: LUMP_SUMS
},
{
  schemeId: SFI_ID,
  name: SFI
},
{
  schemeId: SFI_PILOT_ID,
  name: SFI_PILOT
},
{
  schemeId: VET_VISITS_ID,
  name: VET_VISITS
}]

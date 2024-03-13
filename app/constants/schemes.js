const {
  LNR: LNR_ID,
  LUMP_SUMS: LUMP_SUMS_ID,
  SFI: SFI_ID,
  SFIA: SFIA_ID,
  SFI_PILOT: SFI_PILOT_ID,
  VET_VISITS: VET_VISITS_ID
} = require('./scheme-ids')

const {
  LNR,
  LUMP_SUMS,
  SFI,
  SFIA,
  SFI_PILOT,
  VET_VISITS
} = require('./scheme-names').SHORT_NAMES

module.exports = [{
  schemeId: LNR_ID,
  name: LNR,
  code: LNR_ID + LNR
},
{
  schemeId: LUMP_SUMS_ID,
  name: LUMP_SUMS,
  code: LUMP_SUMS_ID + LUMP_SUMS
},
{
  schemeId: SFI_ID,
  name: SFI,
  code: SFI_ID + SFI
},
{
  schemeId: SFIA_ID,
  name: SFIA,
  code: SFIA_ID + SFIA
},
{
  schemeId: SFI_PILOT_ID,
  name: SFI_PILOT,
  code: SFI_PILOT_ID + SFI_PILOT
},
{
  schemeId: VET_VISITS_ID,
  name: VET_VISITS,
  code: VET_VISITS_ID + VET_VISITS
}]

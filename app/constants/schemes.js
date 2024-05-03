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
  code: LNR_ID.toString() + LNR.toString()
},
{
  schemeId: LUMP_SUMS_ID,
  name: LUMP_SUMS,
  code: LUMP_SUMS_ID.toString() + LUMP_SUMS.toString()
},
{
  schemeId: SFI_ID,
  name: SFI,
  code: SFI_ID.toString() + SFI.toString()
},
{
  schemeId: SFIA_ID,
  name: SFIA,
  code: SFIA_ID.toString() + SFIA.toString()
},
{
  schemeId: SFI_PILOT_ID,
  name: SFI_PILOT,
  code: SFI_PILOT_ID.toString() + SFI_PILOT.toString()
},
{
  schemeId: VET_VISITS_ID,
  name: VET_VISITS,
  code: VET_VISITS_ID.toString() + VET_VISITS.toString()
}]

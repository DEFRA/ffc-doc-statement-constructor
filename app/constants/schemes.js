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
  code: '4LNR'
},
{
  schemeId: LUMP_SUMS_ID,
  name: LUMP_SUMS,
  code: '3Lump Sums'
},
{
  schemeId: SFI_ID,
  name: SFI,
  code: '1SFI'
},
{
  schemeId: SFIA_ID,
  name: SFIA,
  code: '12SFIA'
},
{
  schemeId: SFI_PILOT_ID,
  name: SFI_PILOT,
  code: '2SFI Pilot'
},
{
  schemeId: VET_VISITS_ID,
  name: VET_VISITS,
  code: '5Vet Visits'
}]

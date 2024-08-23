const {
  BPS: BPS_ID,
  CS: CS_ID,
  DP: DP_ID,
  ES: ES_ID,
  ESFIO: ESFIO_ID,
  FC: FC_ID,
  FDMR: FDMR_ID,
  IMPS: IMPS_ID,
  LUMP_SUMS: LUMP_SUMS_ID,
  MANUAL: MANUAL_ID,
  SFI: SFI_ID,
  SFIA: SFIA_ID,
  SFI_PILOT: SFI_PILOT_ID,
  VET_VISITS: VET_VISITS_ID
} = require('./scheme-ids')

const {
  BPS,
  CS,
  DP,
  ES,
  ESFIO,
  FC,
  FDMR,
  IMPS,
  LUMP_SUMS,
  MANUAL,
  SFI,
  SFIA,
  SFI_PILOT,
  VET_VISITS
} = require('./scheme-names').SHORT_NAMES

module.exports = [{
  schemeId: BPS_ID,
  name: BPS,
  code: BPS_ID.toString() + BPS.toString()
},
{
  schemeId: CS_ID,
  name: CS,
  code: CS_ID.toString() + CS.toString()
},
{
  schemeId: DP_ID,
  name: DP,
  code: DP_ID.toString() + DP.toString()
},
{
  schemeId: ES_ID,
  name: ES,
  code: ES_ID.toString() + ES.toString()
},
{
  schemeId: ESFIO_ID,
  name: ESFIO,
  code: ESFIO_ID.toString() + ESFIO.toString()
},
{
  schemeId: FC_ID,
  name: FC,
  code: FC_ID.toString() + FC.toString()
},
{
  schemeId: FDMR_ID,
  name: FDMR,
  code: FDMR_ID.toString() + FDMR.toString()
},
{
  schemeId: IMPS_ID,
  name: IMPS,
  code: IMPS_ID.toString() + IMPS.toString()
},
{
  schemeId: LUMP_SUMS_ID,
  name: LUMP_SUMS,
  code: LUMP_SUMS_ID.toString() + LUMP_SUMS.toString()
},
{
  schemeId: MANUAL_ID,
  name: MANUAL,
  code: MANUAL_ID.toString() + MANUAL.toString()
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

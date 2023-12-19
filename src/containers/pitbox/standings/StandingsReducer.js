import { SET_STANDINGS } from "./StandingsActions";

export default function (state = [], action) {
    switch (action.type) {
        case SET_STANDINGS:
            let mappedStandings = action.standings.map(s=>{
                return {
                    position: s.p,
                    classPosition: s.cp,
                    standingPosition: s.sp,
                    standingClassPosition: s.scp,
                    carNumber: s.cn,
                    className: s.cln,
                    classId: s.ci,
                    classColor: s.cc,
                    carName: s.crn,
                    isCurrentDriver: s.cd,
                    iRating: s.ir,
                    sR: s.sr,
                    driverName: s.dn,
                    driverShortName: s.dns,
                    lapDistancePercent: s.d,
                    teamName: s.t,
                    leaderDelta: s.ld,
                    nextCarDelta: s.nd,
                    lastLaptime: s.lt,
                    bestLaptime: s.bt,
                    lap : s.ln,
                    pitStopCount: s.pc,
                    stintLapCount: s.sl
                }
            })
            return mappedStandings
        default:
            return state;
    }
}
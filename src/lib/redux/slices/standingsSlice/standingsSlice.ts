import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState: StandingSliceState = {
    liveTiming: [],
}

export const standingsSlice = createSlice({
    name: 'standings',
    initialState,
    reducers: {
        update: (state, action: PayloadAction<Array<LiveTimingDto>>) => {
            state.liveTiming = action.payload.map(s => {
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
                    safetyRating: s.sr,
                    driverName: s.dn,
                    driverShortName: s.dns,
                    lapDistancePercent: s.d,
                    teamName: s.t,
                    leaderDelta: s.ld,
                    nextCarDelta: s.nd,
                    lastLaptime: s.lt,
                    bestLaptime: s.bt,
                    lap: s.ln,
                    pitStopCount: s.pc,
                    stintLapCount: s.sl
                }
            })
        },
        reset: (state) => {
            state = initialState
        }
    }
})

export interface StandingSliceState {
    liveTiming: Array<LiveTiming>
}

export interface LiveTimingDto {
    p: number,
    cp: number,
    sp: number,
    scp: number,
    cn: string,
    cln: string,
    ci: number,
    cc: string,
    crn: string,
    cd: boolean,
    ir: number,
    sr: string,
    dn: string,
    dns: string,
    d: number,
    t: string,
    ld: string,
    nd: string,
    lt: number,
    bt: number,
    ln: number,
    pc: number,
    sl: number
}


export interface LiveTiming {
    id: string
    position: number,
    classPosition: number,
    standingPosition: number,
    standingClassPosition: number,
    carNumber: string,
    className: string,
    classId: number,
    classColor: string,
    carName: string,
    isCurrentDriver: boolean,
    iRating: number,
    safetyRating: string,
    driverName: string,
    driverShortName: string,
    lapDistancePercent: number,
    teamName: string,
    leaderDelta: string,
    nextCarDelta: string,
    lastLaptime: number,
    bestLaptime: number,
    lap: number,
    pitStopCount: number,
    stintLapCount: number,
}





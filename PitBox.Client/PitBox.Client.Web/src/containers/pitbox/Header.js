import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { lapsRemainingSelector, currentSessionSelector, currentSessionTimingSelector } from '../../selectors'
import {
  CHeader,
  CToggler,
  CHeaderNav,
  CSubheader,
  CBreadcrumbRouter,
  CBadge
} from '@coreui/react'

// routes config
import routes from './routes'

import {
  HeaderDropdown
} from './index'
import DataDisplay from '../../formatters/DataDisplay'

const Header = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.preferences.sidebarShow)
  const lapsRemaining = useSelector(lapsRemainingSelector)
  const timingPreferences = useSelector(state => state.timingPreferences)
  const isAvailable = useSelector(state => state.pitboxSession?.eventDetails?.isAvailable)
  const session = useSelector(currentSessionSelector)
  const trackName = useSelector(currentSessionSelector)?.track.name
  const sessionTiming = useSelector(currentSessionTimingSelector)
  const selectedDriver = useSelector(state => state.pitboxSession.eventDetails?.standings?.find(standing => timingPreferences.selectedDriverCarNumber !== "-1" ? standing.carNumber === timingPreferences.selectedDriverCarNumber : standing.position === 1))
  const driverStandings = useSelector(state => state.pitboxSession.eventDetails?.standings?.find(standing => standing.isCurrentDriver))

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({ type: 'set-pref', sidebarShow: val })
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({ type: 'set-pref', sidebarShow: val })
  }

  const formatTime = (timeInSeconds) => {
    //Format to M:S:MS
    var pad = function (num, size) { return ('000' + num).slice(size * -1); },
      time = parseFloat(timeInSeconds).toFixed(3),
      hours = Math.floor(time / 60 / 60),
      minutes = Math.floor(time / 60) % 60,
      seconds = Math.floor(time - minutes * 60);

    let formattedHours = hours > 0 ? pad(hours, 2) + ':' : ''
    return formattedHours + pad(minutes, 2) + ':' + pad(seconds, 2);
  }

  const formatPositiveNumberOrUsePlaceholder = (num, placeholder) => {
    return isPositiveNumber(num) ? num.toString() : placeholder
  }

  const isPositiveNumber = (num) => {
    return !(num == null || Math.sign(num) === -1 || Number.isNaN(num))
  }

  const headerContent = () => {
    if (isAvailable) {
      let textContent = driverStandings ? driverStandings.driverName : "Spectator"
      textContent += ' - ' + trackName
      textContent += driverStandings ? ' - ' + driverStandings.carName : ''
      return <><span>{textContent}</span> <CBadge color="danger" className='ml-3'>LIVE</CBadge> </>
    }
    else {
      return <CBadge color="warning" className='ml-3'>OFFLINE</CBadge>
    }
  }
  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <div className="c-header-nav">{headerContent()}</div>
      <CHeaderNav className="px-3 ml-auto">
        <HeaderDropdown />
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter className="border-0 c-subheader-nav m-0 px-0 px-md-3" routes={routes} />

        {isAvailable && sessionTiming &&
          <div className="d-md-down-none mfe-2 c-subheader-nav">

            <DataDisplay title="Type / Status" content={session.sessionType + " / " + session.sessionState} />
            <span className="ml-3"></span>
            <DataDisplay title="Time Remaining" content={formatTime(sessionTiming.raceTimeRemaining?.toFixed(3))} />
            <span className="ml-3"></span>
            {session.isFixedLaps && session.isRace &&
              <>
                <DataDisplay title="Race Lap" content={formatPositiveNumberOrUsePlaceholder(session.raceLaps - lapsRemaining.wholeLapsRemaining, 'calculating...') + "/" + session.raceLaps} />

                <span className="ml-3"></span>
              </>
            }

            {session.isTimed && session.isRace &&
              <>
                <DataDisplay title="Race Lap" content={formatPositiveNumberOrUsePlaceholder(selectedDriver?.lap, '-') + "/~" + (isPositiveNumber(lapsRemaining.wholeRaceLaps) ? lapsRemaining.wholeRaceLaps + " (" + lapsRemaining.raceLaps + ")" : "calculating...")} />

                <span className="ml-3"></span>
              </>
            }

            <DataDisplay title="Flags" content={session.flags} />
            <span className="ml-3"></span>
            <DataDisplay title="Position" content={formatPositiveNumberOrUsePlaceholder(driverStandings?.position === 0 ? -1 : driverStandings?.position, '-')} />
          </div>
        }
      </CSubheader>
    </CHeader>
  )
}

export default Header

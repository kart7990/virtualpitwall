import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavItem,
  CImg
} from '@coreui/react'

// sidebar nav config
import navigation from './_nav'

const Sidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.preferences.sidebarShow)
  const pitboxSessionId = useSelector(state => state.authentication.pitboxSessionId)

  let dynamicNavigation = []

  navigation.forEach(navItem => {
    let dyanmicNavTo = `${navItem.to}`
    //New instance of nav item to not overwrite original
    let dyanmicNavItem = {
      ...navItem
    };
    if (navItem._tag === 'CSidebarNavItem') {
      if(dyanmicNavTo === "/dashboard") {
        dyanmicNavTo = `/pitbox/${pitboxSessionId}/dashboard`
      }
      dyanmicNavItem.to = dyanmicNavTo
    }
    dynamicNavigation.push(dyanmicNavItem)
  })

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: 'set-pref', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <CImg
          src="/name_and_logo255.png"
          class="c-sidebar-brand-full"
          block
          width="175"
        />

        <CImg
          src="/gauge_logo_large.png"
          class="c-sidebar-brand-minimized"
          block
          height="30"
        />
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={dynamicNavigation}
          components={{
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  )
}

export default React.memo(Sidebar)

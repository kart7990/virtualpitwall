import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { logoff } from '../auth/authCore'

const HeaderDropdown = () => {
  const dispatch = useDispatch()
  const name = useSelector(state => state.authentication.name)
  const [modal, setModal] = useState(false)

  return (
    <>
      <CDropdown
        inNav
        className="c-header-nav-items mx-2"
        direction="down"
      >
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <div className="c-avatar">
            <CIcon name="cil-user" className="mfe-2" />
          </div>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem
            header
            tag="div"
            color="light"
            className="text-center"
          >
            <strong>{name}</strong>
          </CDropdownItem>
          <CDropdownItem disabled>
            <CIcon name="cil-user" className="mfe-2" />Profile
          </CDropdownItem>
          {/* <CDropdownItem>
            <CIcon name="cil-credit-card" className="mfe-2" />
          Payments
          <CBadge color="secondary" className="mfs-auto">42</CBadge>
          </CDropdownItem> */}
          <CDropdownItem divider />
          <CDropdownItem onClick={() => dispatch(logoff())} >
            <CIcon name="cil-account-logout" className="mfe-2" />
            Log Out
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>

  )
}

export default HeaderDropdown

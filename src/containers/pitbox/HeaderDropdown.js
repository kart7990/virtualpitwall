import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CLabel,
  CFormGroup,
  CInputRadio
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

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
          <CDropdownItem onClick={() => setModal(!modal)} >
            <CIcon name="cil-settings" className="mfe-2" />
          Settings
        </CDropdownItem>
          {/* <CDropdownItem>
            <CIcon name="cil-credit-card" className="mfe-2" />
          Payments
          <CBadge color="secondary" className="mfs-auto">42</CBadge>
          </CDropdownItem> */}
          <CDropdownItem divider />
          <CDropdownItem>
            <CIcon name="cil-account-logout" className="mfe-2" />
          Log Out
        </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <CModal
        show={modal}
        onClose={setModal}
      >
        <CModalHeader closeButton>
          <CModalTitle>Settings</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormGroup row>
            <CCol md="12">
              <CLabel className="font-weight-bold">Units:</CLabel>
              <CFormGroup variant="checkbox">
                <CInputRadio className="form-check-input" id="metricRadio" name="unitSelection" defaultChecked onChange={e => { dispatch({ type: 'set-pitbox-pref', useImperialUnits: !e.target.checked }) }} value="metric" />
                <CLabel variant="checkbox" htmlFor="metricRadio">Metric (km/h, kg, etc.)</CLabel>
              </CFormGroup>
              <CFormGroup variant="checkbox">
                <CInputRadio className="form-check-input" id="imperialRadio" name="unitSelection" value="imperial" onChange={e => { dispatch({ type: 'set-pitbox-pref', useImperialUnits: e.target.checked }) }} />
                <CLabel variant="checkbox" htmlFor="imperialRadio">Imperial (mph, lb, etc.)</CLabel>
              </CFormGroup>
            </CCol>
          </CFormGroup>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            onClick={() => setModal(false)}
          >Done</CButton>
        </CModalFooter>
      </CModal>
    </>

  )
}

export default HeaderDropdown

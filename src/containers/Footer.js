import React from 'react'
import { CFooter } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { brandSet } from '@coreui/icons'
import BuyMeACoffee from '../views/widgets/BuyMeACoffee'

const Footer = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <span>v0.0.3-beta Copyright © 2021 <strong>Theia Stream, LLC.</strong> All Rights Reserved</span>
      </div>
      <div className="mfs-auto">
        <BuyMeACoffee className="mr-3"/>
        <a href="https://discord.gg/RcMX8FN2G2" target="_blank">
          <CIcon content={brandSet.cibDiscord} style={{ color: '#fff' }} size="2xl" />
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(Footer)

import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import {
  Content,
  Sidebar,
  Header
} from './index'
import {
  Footer
} from '../index'

const Layout = () => {
  const darkMode = useSelector(state => state.preferences.darkMode)
  const classes = classNames(
    'c-app c-default-layout',
    darkMode && 'c-dark-theme'
  )
  return (
    <div className={classes}>
      <Sidebar/>
      <div className="c-wrapper">
        <Header/>
        <div className="c-body">
          <Content/>
        </div>
        <Footer/>
      </div>
    </div>
  )
}

export default Layout

import React from 'react'
import { IndexLink, Link } from 'react-router'
import PropTypes from 'prop-types'
import './PageLayout.scss'

export const PageLayout = ({ children }) => (
  // <div className='text-center'> /// should be added 100% height
  <div className='page-layout__viewport text-center'>
      {/* <IndexLink to='/' activeClassName='page-layout__nav-item--active'>Home</IndexLink>
      {' · '}
      <Link to='/counter' activeClassName='page-layout__nav-item--active'>Counter</Link>  on level up*/}
      {children}
    </div>
  // </div>
)
PageLayout.propTypes = {
  children: PropTypes.node,
}

export default PageLayout

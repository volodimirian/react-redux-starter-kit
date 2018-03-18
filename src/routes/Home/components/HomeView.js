import React from 'react'
import DuckImage from '../assets/Duck.jpg'
import './HomeView.scss'

import MapContainer from '../../../components/Map';
import OrdersTable from './OrdersTable';

export const HomeView = () => (
  <div className="home-view-container">
    <h4>Welcome!</h4>
    <MapContainer></MapContainer>
    {/* <img alt='This is a duck, because Redux!' className='duck' src={DuckImage} /> */}
    <OrdersTable></OrdersTable>
  </div>
)

export default HomeView

import React from 'react'
import './HomeView.scss'

import MapContainer from '../../../components/Map';
import OrdersTable from './OrdersTable';

export const HomeView = () => (
  <div className="home-view-container">
    <h4>Welcome!</h4>
    <MapContainer></MapContainer>
    <OrdersTable></OrdersTable>
  </div>
)

export default HomeView

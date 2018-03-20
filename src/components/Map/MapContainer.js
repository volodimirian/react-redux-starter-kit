import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';

import { saveOrders } from '../../store/orders'

export class MapContainer extends React.Component {
  
  selectMarker(order) {
    let newOrders = {}
    for (let key in this.props.orders) {
      newOrders[key] = Object.assign({}, this.props.orders[key])
      newOrders[key].selected = false;
    }
    newOrders[order.tracking_number].selected = !order.selected;
    this.props.saveOrders(newOrders);
  }

  render() {
    let markers = [];
    for (let key in this.props.orders) {
      if (this.props.orders[key].selected) {
        markers.push(<Marker
            key={key}
            className="marker-non-clicked"
            title={this.props.orders[key].tracking_number}
            name={this.props.orders[key].id}
            position={this.props.orders[key].coord}
            onClick={this.selectMarker.bind(this, this.props.orders[key])}
            icon={{
              url: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/64/map-marker-icon.png',
              anchor: new this.props.google.maps.Point(32, 32),
              scaledSize: new this.props.google.maps.Size(41, 41)
            }}/>)
      } else {
        markers.push(<Marker
            key={key}
            className="marker-non-clicked"
            title={this.props.orders[key].tracking_number}
            name={this.props.orders[key].id}
            position={this.props.orders[key].coord}
            onClick={this.selectMarker.bind(this, this.props.orders[key])}
            icon={this.props.google ? {
              url: 'https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/Google_Maps.png',
              anchor: new this.props.google.maps.Point(32, 32),
              scaledSize: new this.props.google.maps.Size(32, 32)
            } : null} />)
      }
    }

    return (
      <Map
        google={this.props.google}
        zoom={13}
        visible={this.props.mapVisibility}>
        
        {markers}
      </Map>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  orders: state.orders
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveOrders: (orders) => dispatch(saveOrders(orders))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleApiWrapper({
  apiKey: ('AIzaSyALUltJw5KDvpM1uCxDAGLdYG3x5swJVgk')
})(MapContainer))

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

import { saveOrders } from '../../store/orders'
 
const style = {
  width: '100%',
  height: '100%'
}

export class MapContainer extends React.Component {
  state = {
    mapVisibility: false
  }

  componentDidMount() {
    this.setState({
      mapVisibility: true
    })
  }

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
    let selectedMarkers = []
    for (let key in this.props.orders) {
      if (this.props.orders[key].selected) {
        selectedMarkers.push(<Marker
            key={selectedMarkers.length + key}
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
            key={markers.length + key}
            className="marker-non-clicked"
            title={this.props.orders[key].tracking_number}
            name={this.props.orders[key].id}
            position={this.props.orders[key].coord}
            onClick={this.selectMarker.bind(this, this.props.orders[key])} 
            icon={{
              url: 'https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/Google_Maps.png',
              anchor: new this.props.google.maps.Point(32, 32),
              scaledSize: new this.props.google.maps.Size(32, 32)
            }} />)
      }
      markers = [...selectedMarkers, ...markers];
    }

    return (
      <Map 
        google={this.props.google} 
        style={style} 
        zoom={13}
        visible={this.props.mapVisibility}>

        {markers}
        {/* <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow> */}
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

/* export default GoogleApiWrapper({
  apiKey: ('AIzaSyALUltJw5KDvpM1uCxDAGLdYG3x5swJVgk')
})(MapContainer) */
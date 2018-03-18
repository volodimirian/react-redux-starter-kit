import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
 
const style = {
  width: '100%',
  height: '47%'
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

  render() {
    return (
      <Map 
        google={this.props.google} 
        style={style} 
        zoom={15}
        visible={this.props.mapVisibility}>
 
        <Marker  />
        {/* <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow> */}
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyALUltJw5KDvpM1uCxDAGLdYG3x5swJVgk')
})(MapContainer)
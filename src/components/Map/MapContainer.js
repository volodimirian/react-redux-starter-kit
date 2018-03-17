import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
 
export class MapContainer extends React.Component {
  style = {
    width: '100%',
    height: '100%'
  }
  
  render() {
    return (
      <Map google={this.props.google} zoom={14}>
 
        <Marker 
          zoom={15}
          style={this.style} />
 
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
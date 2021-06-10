import logo from './logo.svg';
import './App.css';

import React from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
// import { formatRelative } from 'date-fns';

// set libraries to it's own variable to prevent rerendering by react
const libraries = ['places']
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
}
const center = {
  lat: 40.7128,
  lng: -74.0060,
}
const options = {
  // add map styles if you'd like to edit the way the map looks
  // this will remove the default pins, zoom control, on the map
  disableDefaultUI: true,
  streetViewControl: true,
  zoomControl: true
}

export default function App() {
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  })
  // set state
  const [markers, setMarkers] = React.useState([])

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return <div>
    <h1>Live Local Music Map
      <span role='img' aria-label='music'> 🎶</span>
    </h1>
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={center}
      options={options}
      onClick={(event) => {
        setMarkers(current => [
          ...current,
          {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            time: new Date(),
          },
        ])
      }
      }
    ></GoogleMap>
  </div>
}

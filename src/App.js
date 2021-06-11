import './App.css';

import React from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { formatRelative } from 'date-fns';

// import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

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
  const [selected, setSelected] = React.useState()

  const onMapClick = React.useCallback((event) => {
    setMarkers(current => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ])
  }, [])

  // mapRef will retain state without rendering the page
  const mapRef = React.useRef()
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
  }, [])

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return <div>
    <h1>Live Local Music Map</h1>
    {/* <Search /> */}
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={center}
      options={options}
      // this on click will keep each click in a spread array for each state
      // each click represents a new marker (state)
      onClick={onMapClick}
      onLoad={onMapLoad}
    >
      {/* create markers on click within google maps */}
      {markers.map(marker => <Marker
        key={marker.time.toISOString()}
        position={{ lat: marker.lat, lng: marker.lng }}
        icon={{
          url: '/music_marker.svg',
          scaledSize: new window.google.maps.Size(30, 30),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15)
        }}
        onClick= {() => {
          setSelected(marker)
        }}
      />)}
      {selected ? (<InfoWindow
        position={{ lat: selected.lat, lng: selected.lng }}
        onCloseClick={() => setSelected(null)}>
        <div>
          <h2>Live Music Here</h2>
          <p>Time identified: {formatRelative(selected.time, new Date())}</p>
        </div>
      </InfoWindow>) : null}
    </GoogleMap>
  </div>
}

// function Search() {
//   const {
//     ready,
//     value,
//     suggestions: {status, data},
//     setValue,
//     clearSuggestions} = usePlacesAutocomplete({
//     requestOptions: {
//       location: {  lat: () => 40.7128, lng: () => -74.0060,},
//       // want radius to be 200km, but it reads in meters so multiply
//       radius: 200 * 1000,
//     }
//   })
// }

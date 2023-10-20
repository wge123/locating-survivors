import React, { useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import PropTypes from 'prop-types'

// Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWtlZW5sIiwiYSI6ImNsbm94eWFuZDBoMzYyanFtNm5teDBnYW0ifQ.UQ5J0KuMiExOXBYS_m-AEQ'

Map.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
}
export default function Map({ lat, lng }) {
    if(!lat || !lng){
        return <div></div>
    }
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [lng, lat], // starting position [lng, lat]
            zoom: 9, // starting zoom
        })

        // Add marker
        new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map)
    }, [lat, lng])

    return <div id='map' style={{ height: '400px', width: '100%'}}></div>

}

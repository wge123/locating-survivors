import React, {useEffect, useState} from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import '../screens/case_view_screen/caseView.css'

// Mapbox token
// add api call here
mapboxgl.accessToken = 'pk.eyJ1IjoiYWtlZW5sIiwiYSI6ImNsbm94eWFuZDBoMzYyanFtNm5teDBnYW0ifQ.UQ5J0KuMiExOXBYS_m-AEQ'

export default function Map({ lat, lng }) {
    const [mapboxToken, setMapboxToken] = useState<string>('');
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch('/your-server-endpoint-for-token');
                const data = await response.json();
                if (data.token) {
                    setMapboxToken(data.token);
                } else {
                    setHasError(true);
                }
            } catch (error) {
                setHasError(true);
                console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, []);

    useEffect(() => {
        // test 1
        if (!mapboxToken || !lat || !lng || hasError) {
            return;
        }

        mapboxgl.accessToken = mapboxToken;

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: 9,
        });

        new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map);
    }, [lat, lng, mapboxToken, hasError]);

    // test 2 and 3
    return hasError ? (
        <div id='cv-empty-map'>
            <FontAwesomeIcon icon={faExclamationTriangle} size="10x" id="faExclamationTriangle"/>
            <h2 id="errorHeader">Oops! Something Went Wrong.</h2>
            <p>MapBox Didn't Load Correctly. Please Reach Out To Your IT Admin For Details</p>
        </div>
    ) : (
        <div id='map' style={{ height: '400px', width: '100%' }}></div>
    );
}

Map.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
};

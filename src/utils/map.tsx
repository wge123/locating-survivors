import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import '../screens/case_view_screen/caseView.css'

export default function Map({ lat, lng }) {
    const [mapboxToken, setMapboxToken] = useState<string>('')
    const [hasError, setHasError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(true)
    const headers = {
        Authorization: `Bearer ${sessionStorage.getItem('idToken')}`,
        'Content-Type': 'application/json'
    }
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const url = 'https://6u7yn5reri.execute-api.us-east-1.amazonaws.com/prod/keys/mapbox'
                const response = await fetch(url,{headers})
                const data = await response.json()
                const token = JSON.parse(data.body).token
                if (token) {
                    setMapboxToken(token)
                } else {
                    setHasError(true)
                }
            } catch (error) {
                setHasError(true)
                console.error('Error fetching token:', error)
            }
            setIsLoading(false)
        }
        fetchToken()
    }, [])

    useEffect(() => {

        if (isLoading) return

        if (!mapboxToken || !lat || !lng) {
            setHasError(true)
            return
        }

        mapboxgl.accessToken = mapboxToken
        try {
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: 9,
            })

            new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .addTo(map)
        } catch (e) {
            console.log(e)
            setHasError(true)
        }

    }, [lat, lng, mapboxToken, hasError, isLoading])

    return hasError ? (
        <div id='cv-empty-map'>
            <FontAwesomeIcon icon={faExclamationTriangle} size="10x" id="faExclamationTriangle" />
            <h2 id="errorHeader">Oops! Something Went Wrong.</h2>
            <p>MapBox Didn&apos;t Load Correctly. Please Reach Out To Your IT Admin For Details</p>
        </div>
    ) : (
        <div id='map' style={{ height: '400px', width: '70%', marginBottom: '20px', marginTop: '10px', border: '1px solid #000', borderRadius: '10px' }} />
    )
}

Map.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
}

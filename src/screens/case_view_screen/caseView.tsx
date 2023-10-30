import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import './caseView.css'
import { ReactComponent as ChevronIcon } from '../../assets/chevron.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment-timezone'
import AccessCaseViewContext from '../../context/accessCaseViewContext.tsx'
import { exportCase } from '../../utils/exportCase.tsx'
import Map from '../../utils/map.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'


export default function CaseViewScreen() {
    const navigate = useNavigate()
    const accessToCaseView = useContext(AccessCaseViewContext)
    const [selectedTimezone, setSelectedTimezone] = useState('America/New_York')

    useEffect(() => {
        if (!accessToCaseView) {
            navigate('/case_list')
        }
    }, [accessToCaseView, navigate])

    useLayoutEffect(() => {
        document.body.style.backgroundColor = '#1C1B1FBF'
    })

    const location = useLocation()
    function getCaseCarrier(): string {
        // Currently only spring
        return 'Sprint'
    }

    function onBackButtonClick() {
        return navigate('/case_list')
    }
    let state = null
    if (location) {
        state = location.state
    }
    let caseData = null
    if (state) {
        caseData = state.caseData
    }


    const lat = caseData && caseData.latitude && caseData.latitude[(caseData.latitude).length - 1] ? caseData.latitude[(caseData.latitude).length - 1] : 'N/A'
    function getCaseLatitude(): string {
        return lat
    }

    const lng = caseData && caseData.longitude && caseData.longitude[(caseData.longitude).length - 1] ? caseData.longitude[(caseData.longitude).length - 1] : 'N/A'
    function getCaseLongitude(): string {
        return lng
    }

    function getCaseUncertainty(): string {
        if (caseData && caseData.uncertainty) {
            return caseData.uncertainty[(caseData.uncertainty.length) - 1]
        } else {
            return 'N/A'
        }
    }

    function getCaseLastUpdate(): string {
        let lastUpdated = null
        if (caseData) {
            lastUpdated = caseData.time_updated
        }
        let lastUpdatedFormatted = 'Not Filled'
        if (lastUpdated) {
            lastUpdatedFormatted = moment(lastUpdated).tz(selectedTimezone).format('M/D/YYYY h:mm:ss A')
        }
        return lastUpdatedFormatted
    }

    function getCaseTimeUntilNextUpdate(): string {
        let nextUpdate = null
        if (caseData) {
            nextUpdate = new Date(caseData.next_update)
        }
        const currentTime = new Date()
        let milliseconds = 0
        if (nextUpdate) {
            milliseconds = nextUpdate.getTime() - currentTime.getTime()
        }
        if (milliseconds < 0) {
            milliseconds = 0
        }
        return Math.round(milliseconds / (1000 * 60)) + ' minutes'
    }

    function convertCoordinate(coord: string) {
        const number = parseFloat(coord?.split(' ')[0])
        const direction = coord?.split(' ')[1]

        return direction === 'S' || direction === 'W' ? -number : number
    }

    const coordsContainNil: boolean = lat === 'N/A' || lng === 'N/A'

    return (
        <div id='cv-container'>
            <button id='cv-back-button' onClick={() => onBackButtonClick()}>
                <ChevronIcon />
                {'Cases'}
            </button>
            <div id='cv-main-content'>
                <div id='cv-pane-small' className='cv-pane'>
                    <p className='cv-text'>{`Carrier: ${getCaseCarrier()}`}</p>
                    <div className='cv-text-gap' />
                    <p className='cv-text'>{`Latitude: ${getCaseLatitude()}`}</p>
                    <p className='cv-text'>{`Longitude: ${getCaseLongitude()}`}</p>
                    <p className='cv-text'>{`Uncertainty: ${getCaseUncertainty()}`}</p>
                </div>
                <div id='cv-pane-small' className='cv-pane'>
                    <p className='cv-text'>Last update on:</p>
                    <p className='cv-text'>{getCaseLastUpdate()}</p>
                    <div id='cv-text-div'>
                        <select
                            className='select-timezone'
                            defaultValue='America/New_York'
                            onChange={(e) => setSelectedTimezone(e.target.value)}
                        >
                            {moment.tz.names().filter(zone => zone.includes('America')).map((zone) => (
                                <option key={zone} value={zone}>
                                    {zone}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='cv-text-gap' />
                    <p className='cv-text'>{`${getCaseTimeUntilNextUpdate()} until next update`}</p>
                </div>
                <div id='cv-pane-big' className='cv-pane'>
                    {lat != 'N/A' || lng != 'N/A' ?
                        (
                            <Map lat={convertCoordinate(lat)} lng={convertCoordinate(lng)} />
                        ) :
                        <div id='cv-empty-map'>
                            <FontAwesomeIcon icon={faExclamationTriangle} size="10x" id="faExclamationTriangle" />
                            <h2 id="errorHeader">Oops! Something Went Wrong.</h2>
                            <p>MapBox Didn&apos;t Load Correctly. Please Reach Out To Your IT Admin For Details</p>
                        </div>
                    }

                    <div id='cv-bottom-buttons'>
                        <button className='cv-bottom-button' onClick={() => exportCase(caseData)} disabled={coordsContainNil}>
                            Export to SAROPS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
import React, {useContext, useEffect, useLayoutEffect} from 'react'
import './caseView.css'
import {ReactComponent as ChevronIcon} from '../../assets/chevron.svg'
import {useLocation, useNavigate} from 'react-router-dom'
import moment from 'moment-timezone'
import AccessCaseViewContext from '../../context/accessCaseViewContext.tsx'
import {exportCase} from '../../utils/exportCase.tsx'
import Map from '../../utils/map.tsx'


export default function CaseViewScreen() {
    const navigate = useNavigate()
    const accessToCaseView  = useContext(AccessCaseViewContext)

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
    if(location){
        state = location.state
    }
    let caseData = null
    if(state){
        caseData = state.caseData
    }

    const lat = caseData ? caseData.latitude[0] : 'Not Filled'
    function getCaseLatitude(): string {
        return lat
    }

    const lng = caseData ? caseData.longitude[0] : 'Not Filled'
    function getCaseLongitude(): string {
        return lng
    }

    function getCaseUncertainty(): string {
        if (caseData && caseData.uncertainty) {
            return caseData.uncertainty[0]
        } else {
            return 'Not Filled'
        }
    }

    function getCaseLastUpdate(): string {
        let lastUpdated = null
        if(caseData){
            lastUpdated = caseData.time_updated
        }
        let lastUpdatedFormatted = ' Not Filled '
        if (lastUpdated) {
            lastUpdatedFormatted = moment(lastUpdated).tz('America/New_York').format('M/D/YYYY h:mm:ss A')
        }
        return lastUpdatedFormatted
    }

    function getCaseTimeUntilNextUpdate(): string {
        let nextUpdate = null
        if(caseData){
            nextUpdate = new Date(caseData.next_update)
        }
        const currentTime = new Date()
        let milliseconds = 0
        if(nextUpdate) {
            milliseconds = currentTime.getTime() - nextUpdate.getTime()
        }
        return Math.round(milliseconds / (1000 * 60)) + ' minutes'
    }

    function convertCoordinate(coord: string) {
        const number = parseFloat(coord?.split(' ')[0])
        const direction = coord?.split(' ')[1]

        return direction === 'S' || direction === 'W' ? -number : number
    }

    return (
        <div id='cv-container'>
            <button id='cv-back-button' onClick={() => onBackButtonClick()}>
                <ChevronIcon/>
                {'Cases'}
            </button>
            <div id='cv-main-content'>
                <div id='cv-pane-small' className='cv-pane'>
                    <p className='cv-text'>{`Carrier: ${getCaseCarrier()}`}</p>
                    <div className='cv-text-gap'/>
                    <p className='cv-text'>{`Latitude: ${getCaseLatitude()}`}</p>
                    <p className='cv-text'>{`Longitude: ${getCaseLongitude()}`}</p>
                    <p className='cv-text'>{`Uncertainty: ${getCaseUncertainty()}`}</p>
                </div>
                <div id='cv-pane-small' className='cv-pane'>
                    <p className='cv-text'>Last update on:</p>
                    <p className='cv-text'>{getCaseLastUpdate()}</p>
                    <div className='cv-text-gap'/>
                    <p className='cv-text'>{`${getCaseTimeUntilNextUpdate()} until next update`}</p>
                </div>
                <div id='cv-pane-big' className='cv-pane'>
                    <Map lat={convertCoordinate(lat)} lng={convertCoordinate(lng)} />
                    <div id='cv-bottom-buttons'>
                        <button className='cv-bottom-button' onClick={() => exportCase(caseData)}>
                            Export to SAROPS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
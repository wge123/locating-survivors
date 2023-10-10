import React, {useLayoutEffect} from 'react'
import './caseView.css'
import {ReactComponent as ChevronIcon} from '../../assets/chevron.svg'
import {useLocation} from 'react-router-dom'
import moment from 'moment-timezone'

export default function CaseViewScreen() {
    const location = useLocation()

    useLayoutEffect(() => {
        document.body.style.backgroundColor = '#1C1B1FBF'
    })

    console.log(location.state?.caseData)
    const caseData = location.state?.caseData
    function getCaseLatitude(): string {
        return caseData.latitude[0] ? caseData.latitude[0] : 'Not Filled'
    }

    function getCaseLongitude(): string {
        return caseData.longitude[0] ? caseData.longitude[0] : 'Not Filled'
    }

    function getCaseUncertainty(): string {
        return caseData.uncertainty[0] ? caseData.uncertainty[0] : 'Not Filled'
    }

    function getCaseLastUpdate(): string {
        const lastUpdated = caseData.time_updated
        let lastUpdatedFormatted = ' Not Filled '
        if (lastUpdated){
            lastUpdatedFormatted = moment(lastUpdated).tz('America/New_York').format('M/D/YYYY h:mm:ss A')
        }
        return  lastUpdatedFormatted
    }

    function getCaseTimeUntilNextUpdate(): string {
        const nextUpdate = new Date(caseData.next_update)
        const currentTime = new Date()
        const milliseconds = currentTime.getTime() - nextUpdate.getTime()
        return Math.round(milliseconds / (1000 * 60)) + ' minutes'
    }

    return (
        <div id='cv-container'>
            <button id='cv-back-button' onClick={() => onBackButtonClick()}>
                <ChevronIcon />
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
                    {/* TODO: WE NEED TO REPLACE THIS MAP IMAGE WITH AN ACTUAL MAP OF THE SURVIVOR */}
                    <img src={require('../../assets/tempSurvivorMap.png')} height={'80%'}/>
                    <div id='cv-bottom-buttons'>
                        <button className='cv-bottom-button' onClick={() => onPingButtonClick()}>
                            Ping
                        </button>
                        <button className='cv-bottom-button' onClick={() => onExportButtonClick()}>
                            Export to SAROPS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getCaseCarrier(): string {
    // Currently only spring
    return 'Sprint'
}

function onBackButtonClick() {
    // TODO: Not yet implemented.
    return
}

function onPingButtonClick() {
    // TODO: Not yet implemented.
    return
}

function onExportButtonClick() {
    // TODO: Not yet implemented.
    return
}
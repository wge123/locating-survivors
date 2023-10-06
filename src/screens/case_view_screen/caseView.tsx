import React, { useLayoutEffect } from 'react'
import './caseView.css'
import { ReactComponent as ChevronIcon } from '../../assets/chevron.svg'

export default function CaseViewScreen() {
    useLayoutEffect(() => {
        document.body.style.backgroundColor = '#1C1B1FBF'
    })

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
    // TODO: We need to get this value from the backend.
    return 'Verizon'
}

function getCaseLatitude(): string {
    // TODO: We need to get this value from the backend.
    return '40.032839'
}

function getCaseLongitude(): string {
    // TODO: We need to get this value from the backend.
    return '-75.117860'
}

function getCaseUncertainty(): string {
    // TODO: We need to get this value from the backend.
    return '3339m'
}

function getCaseLastUpdate(): string {
    // TODO: We need to get this value from the backend.
    return '9/17/2021 5:19:05 AM Pacific'
}

function getCaseTimeUntilNextUpdate(): string {
    // TODO: We need to get this value from the backend.
    return '10 Minutes'
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
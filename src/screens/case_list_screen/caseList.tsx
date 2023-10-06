import React, {useState} from 'react'
import './caseList.css'

// This is NOT a model for an actual case from the backend. 
// This is simply the information we need for displaying the case on the frontend. 
// We should fill these parameters with data that we GET from the backend.
interface CaseForDisplay {
    lastUpdate: string,
    status: string,
    duration: string
}

export default function CaseListScreen(): JSX.Element {
    const [cases, setCases] = useState<CaseForDisplay[]>([])

    return (
        <div id='cl-container'>
            <div id='cl-left-pane'>
                <p id='cl-lp-header-text'>Sort By...</p>
                {getRadioButtonWithText('Show Active Only')}
                {getRadioButtonWithText('Duration (d)')}
                {getRadioButtonWithText('Duration (a)')}
                <div id='cl-user-info-box'>
                    <p className='cl-uib-text'>{getUserFullName()}</p>
                    <p className='cl-uib-text'>Operator</p>
                </div>
            </div>
            <div id='cl-main-content'>
                {cases.map((caseForDisplay, index) => (
                    <>
                        {getCaseItem(index, caseForDisplay.lastUpdate, caseForDisplay.status, caseForDisplay.duration)}
                    </>
                ))}
                <button id='cl-mc-bottom-button' onClick={() => navigateToNewCaseScreen()}>New Case...</button>
            </div>
        </div>
    )
}

function getCaseItem(key: number, lastUpdate: string, status: string, duration: string): JSX.Element {
    return (
        <div id='cl-ci-container' key={key}>
            <div id='cl-ci-left-pane'>
                <p id='cl-cit-left-align' className='cl-ci-text'>{`Last Update: ${lastUpdate}`}</p>
                <p id='cl-cit-left-align' className='cl-ci-text'>{`Status: ${status}`}</p>
            </div>
            <div id='cl-ci-middle-pane'>
                <p id='cl-cit-center-align' className='cl-ci-text'>{`Duration: ${duration}`}</p>
            </div>
            <div id='cl-ci-right-pane'>
                <button id='cl-ci-top-button' onClick={() => exportCase()}>Export...</button>
                <button id='cl-ci-bottom-button' onClick={() => navigateToViewCaseScreen()}>View...</button>
            </div>
        </div>
    )
}

function getRadioButtonWithText(text: string): JSX.Element {
    return (
        <div id='cl-radio-button-with-text'>
            <input id='cl-radio-button' name='clRadioButton' type="radio" />
            <p id='cl-radio-button-text'>{text}</p>
        </div>
    )
}

function exportCase() {
    // TODO: We need to save the case info as a CSV. Should this be handled by the backend?
    return
}

function navigateToViewCaseScreen() {
    // TODO: We need to navigate to the case view screen.
    return
}

function navigateToNewCaseScreen() {
    // TODO: We need to navigate to the new case screen.
    return
}

function getUserFullName(): string {
    // TODO: We need to get this value from the backend.
    return 'Edward X. Ample'
}

function getUserRole(): string {
    // "Operator" is the default role.
    // TODO: We need to get this value from the backend.
    return 'Operator'
}

// TODO: We need to modify this function to retrieve cases from the backend, and then fit that data to our "CaseForDisplay" UI model so that we may display those cases on the frontend.
// NOTE: The UI has already been tested with mock data using the "CaseForDisplay" model.
function getCases(): CaseForDisplay[] {
    return []
}

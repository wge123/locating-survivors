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
    // TODO: We need to get the cases from the backend. Also, where should we set them???
    const mockCases: CaseForDisplay[] = getMockCases()

    // TODO: The default value for this should probably be an empty array (instead of mock cases).
    const [cases, setCases] = useState<CaseForDisplay[]>(mockCases)

    return (
        <div id='cl-container'>
            <div id='cl-left-pane'>
                <p id='cl-lp-header-text'>Sort By...</p>
                {getRadioButtonWithText('Show Active Only')}
                {getRadioButtonWithText('Duration (d)')}
                {getRadioButtonWithText('Duration (a)')}
                <div id='cl-user-info-box'>
                    <p className='cl-uib-text'>{getUserFullName()}</p>
                    <p className='cl-uib-text'>{`(${getUserRole()})`}</p>
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

// TODO: Delete this function when we figure out a clean way to get cases from the backend.
function getMockCases(): CaseForDisplay[] {
    return [
        {
            lastUpdate: '15:45 EST',
            status: 'SAR En Route',
            duration: '00:23:25'
        },
        {
            lastUpdate: '13:13 EST',
            status: 'Located Survivor',
            duration: '00:33:14'
        },
        {
            lastUpdate: '11:34 EST',
            status: 'Survivor NID',
            duration: '00:28:42'
        },
        {
            lastUpdate: '05:14 EST',
            status: 'Survivor Rescued',
            duration: '00:40:49'
        },
        {
            lastUpdate: '15:45 EST',
            status: 'SAR En Route',
            duration: '00:23:25'
        },
        {
            lastUpdate: '13:13 EST',
            status: 'Located Survivor',
            duration: '00:33:14'
        },
        {
            lastUpdate: '11:34 EST',
            status: 'Survivor NID',
            duration: '00:28:42'
        },
        {
            lastUpdate: '05:14 EST',
            status: 'Survivor Rescued',
            duration: '00:40:49'
        }
    ]
}
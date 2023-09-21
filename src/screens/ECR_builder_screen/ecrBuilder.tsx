import React, { useLayoutEffect } from 'react'
import './ecrBuilder.css'
import {useLocation} from 'react-router-dom'

export default function ECRBuilderScreen() {
    const location = useLocation()
    const phoneNumber = location.state?.phone_number || '1800411PAIN'

    function getCellPhoneNumber(phoneNumberString): string {
        const countryCode = phoneNumberString.substring(0, 1)
        const areaCode = phoneNumberString.substring(1, 4)
        const firstPart = phoneNumberString.substring(4, 7)
        const secondPart = phoneNumberString.substring(7, 11)
        return `+${countryCode} ${areaCode}-${firstPart}-${secondPart}`
    }

    useLayoutEffect(() => {
        document.body.style.backgroundColor = '#1C1B1F80'
    })

    return (
        <div id='ecrb-container'>
            <div className='ecrb-row'>
                <p className='ecrb-form-header-text'>{`Request Type: ${getRequestType()}`}</p>
                <p className='ecrb-form-header-text'>{`Cell: ${getCellPhoneNumber(phoneNumber)}`}</p>
            </div>
            <div id='ecrb-first-row'>
                { getTextBoxWithLabel('Analyst Name', getUserDisplayName()) }
                { getTextBoxWithLabel('Case #', getCaseNumber()) }
            </div>
            <div id='ecrb-second-row'>
                { getTextBoxWithLabel('Date', getTodaysDate()) }
                { getTextBoxWithLabel('Email', getUserDisplayEmail()) }
                <div>
                    {/* Including an invisible text here so that the button lines up perfectly with the other items in this row. */}
                    <p id='ecrb-edit-account-button-label-text'>Ghost Text</p>
                    <button id='ecrb-edit-account-button'>
                        Edit Account Info...
                    </button>
                </div>
            </div>
            <p className='ecrb-section-header-text'>
                Type of Records Being Requested
            </p>
            <div className='ecrb-evenly-spaced-two-column-row'>
                { getCheckBoxWithText('Subscriber Information') }
                { getCheckBoxWithText('Periodic Location Updates (15 Minute Intervals)') }
            </div>
            <div className='ecrb-evenly-spaced-two-column-row'>
                { getCheckBoxWithText('Last Known Location Information') }
                <div id='ecrb-dropdown-with-text'>
                    <select id='ecrb-dropdown'> 
                        <option>1</option>
                        <option>3</option>
                        <option>6</option>
                        <option>12</option>
                        <option>24</option>
                        <option>48</option>
                    </select>
                    <p id='ecrb-dropdown-text'>Duration (max 48 hours)</p>
                </div>
            </div>
            <p className='ecrb-section-header-text'>
                Additional Historical Records Requested
            </p>
            <div className='ecrb-evenly-spaced-one-column-row'>
                { getCheckBoxWithText('Incoming and outgoing call detail to and from target phone. Includes time/date.') }
            </div>
            <div className='ecrb-evenly-spaced-two-column-row-small-width'>
                { getRadioButtonWithText('With Cell Sites') }
                { getRadioButtonWithText('Without Cell Sites') }
            </div>
            <div className='ecrb-evenly-spaced-one-column-row'>
                { getCheckBoxWithText('SMS Detail - Incoming and outgoing text message detail to and from target phone. Includes time/date.') }
            </div>
            <div className='ecrb-row'>
                <button className='ecrb-solid-gray-button'>
                    Preview ECR...
                </button>
                <button id='ecrb-solid-blue-button'>
                    Send ECR
                </button>
                <button className='ecrb-solid-gray-button'>
                    See Status...
                </button>
            </div>
        </div>
    )
}

// TODO: Make this a separate component in a different file.
function getTextBoxWithLabel(label: string, text: string): JSX.Element {
    return (
        <div>
            <p className='ecrb-text-box-label-text'>{label}</p>
            <div className='ecrb-text-box'>
                <p className='ecrb-text-box-text'>{text}</p>
            </div>
        </div>
    )
}

// TODO: Make this a separate component in a different file.
function getCheckBoxWithText(text: string): JSX.Element {
    return (
        <div className='ecrb-check-box-with-text'>
            <input className='ecrb-check-box' type="checkbox" />
            <p className='ecrb-check-box-text'>{text}</p>
        </div>
    )
}

// TODO: Make this a separate component in a different file.
function getRadioButtonWithText(text: string): JSX.Element {
    return (
        <div className='ecrb-radio-button-with-text'>
            <input className='ecrb-radio-button' type="radio" />
            <p className='ecrb-radio-button-text'>{text}</p>
        </div>
    )
}

function getRequestType(): string {
    // TODO: We need to get this value from the backend.
    return 'Verizon'
}



function getUserDisplayName(): string {
    // TODO: We need to get this value from the backend
    return 'Edward X. Ample, SAR Operator'
}

function getCaseNumber(): string {
    // TODO: We need to get this value from the backend
    return 'CF-123456789'
}

function getTodaysDate(): string {
    const newDate: Date = new Date()
    const month: number = newDate.getMonth() + 1
    const day: number = newDate.getDay() + 1
    const year: number = newDate.getFullYear()
    return `${month}/${day}/${year}`
}

function getUserDisplayEmail(): string {
    // TODO: We need to get this value from the backend
    return 'example@uscg.sarcfs.gov'
}
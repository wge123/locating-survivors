import React, { useState } from 'react'
import './ecrBuilder.css'

export default function ECRBuilderScreen() {
    return (
        <div id='container'>
            <div className='row'>
                <p className='form-header-text'>{`Request Type: ${getRequestType()}`}</p>
                <p className='form-header-text'>{`Cell: ${getCellPhoneNumber()}`}</p>
            </div>
            <div id='first-row'>
                <div className='text-box-with-label'>
                    <p className='text-box-label-text'>Analyst Name</p>
                    <div className='text-box'>
                        <p className='text-box-text'>{getUserDisplayName()}</p>
                    </div>
                </div>
                <div className='text-box-with-label'>
                    <p className='text-box-label-text'>Case #</p>
                    <div className='text-box'>
                        <p className='text-box-text'>{getCaseNumber()}</p>
                    </div>
                </div>
            </div>
            <div id='second-row'>
                <div className='text-box-with-label'>
                    <p className='text-box-label-text'>Date</p>
                    <div className='text-box'>
                        <p className='text-box-text'>{getTodaysDate()}</p>
                    </div>
                </div>
                <div className='text-box-with-label'>
                    <p className='text-box-label-text'>Email</p>
                    <div className='text-box'>
                        <p className='text-box-text'>{getUserDisplayEmail()}</p>
                    </div>
                </div>
                <div id='edit-account-button-container'>
                    {/* Including an invisible text here so that the button lines up perfectly with the other items in this row. */}
                    <p id='edit-account-button-label-text'>Ghost Text</p>
                    <button id='edit-account-button'>
                        Edit Account Info...
                    </button>
                </div>
            </div>
            <p className='section-header-text'>Type of Records Being Requested</p>
            <div className='evenly-spaced-two-column-row'>
                <div className='check-box-with-text'>
                    <input className='check-box' type="checkbox" />
                    <p className='check-box-text'>Subscriber Information</p>
                </div>
                <div className='check-box-with-text'>
                    <input className='check-box' type="checkbox" />
                    <p className='check-box-text'>Periodic Location Updates (15 Minute Intervals)</p>
                </div>
            </div>
            <div className='evenly-spaced-two-column-row'>
                <div className='check-box-with-text'>
                    <input className='check-box' type="checkbox" />
                    <p className='check-box-text'>Last Known Location Information</p>
                </div>
                <div id='dropdown-with-text'>
                    <select id='dropdown'> 
                        <option>1</option>
                        <option>3</option>
                        <option>6</option>
                        <option>12</option>
                        <option>24</option>
                        <option>48</option>
                    </select>
                    <p id='dropdown-text'>Duration (max 48 hours)</p>
                </div>
            </div>
            <p className='section-header-text'>Additional Historical Records Requested</p>
            <div className='evenly-spaced-one-column-row'>
                <div className='check-box-with-text'>
                    <input className='check-box' type="checkbox" />
                    <p className='check-box-text'>Incoming and outgoing call detail to and from target phone. Includes time/date.</p>
                </div>
            </div>
            <div className='evenly-spaced-two-column-row-small-width'>
                <div className='radio-button-with-text'>
                    <input className='radio-button' type="radio" />
                    <p className='radio-button-text'>With Cell Sites</p>
                </div>
                <div className='radio-button-with-text'>
                    <input className='radio-button' type="radio" />
                    <p className='radio-button-text'>Without Cell Sites</p>
                </div>
            </div>
            <div className='evenly-spaced-one-column-row'>
                <div className='check-box-with-text'>
                    <input className='check-box' type="checkbox" />
                    <p className='check-box-text'>SMS Detail - Incoming and outgoing text message detail to and from target phone. Includes time/date.</p>
                </div>
            </div>
            <div className='row'>
                <button className='solid-gray-button'>
                    Preview ECR...
                </button>
                <button id='solid-blue-button'>
                    Send ECR
                </button>
                <button className='solid-gray-button'>
                    See Status...
                </button>
            </div>
        </div>
    )
}

function getRequestType(): string {
    // TODO: We need to get this value from the backend.
    return 'Verizon'
}

function getCellPhoneNumber(): string {
    // TODO: We need to get this value from the backend
    return '407-608-8075'
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
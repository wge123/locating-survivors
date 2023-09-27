import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import './ecrBuilder.css'
import {useLocation, useNavigate} from 'react-router-dom'
import PropTypes from 'prop-types'
import AccessPDFContext from '../../context/accessPDFContext.tsx'

export default function ECRBuilderScreen(props) {
    const location = useLocation()
    const phoneNumber = location.state?.phone_number || '4158586273'
    ECRBuilderScreen.propTypes = {
        user: PropTypes.object.isRequired
    }


    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`http://apilayer.net/api/validate?access_key=012b48564658b54d608f85aa6e048449&number=${phoneNumber}&country_code=US&format=1`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then((jsonData) => {
                setData(jsonData)
                setLoading(false)
            })
    }, [])
    const {user} = props

    function getCellPhoneNumber(phoneNumberString): string {
        const countryCode = phoneNumberString.substring(0, 1)
        const areaCode = phoneNumberString.substring(1, 4)
        const firstPart = phoneNumberString.substring(4, 7)
        const secondPart = phoneNumberString.substring(7, 11)
        return `+${countryCode} ${areaCode}-${firstPart}-${secondPart}`
    }

    function getUserDisplayName(): string {
        return ( user.attributes.name || 'Edward X. Ample' )
    }

    function getTodaysDate(): string {
        const newDate: Date = new Date()
        const month: number = newDate.getMonth() + 1
        const day: number = newDate.getDate()
        const year: number = newDate.getFullYear()
        return `${month}/${day}/${year}`
    }

    function getUserDisplayEmail(): string {
        return user.attributes.email
    }

    const { setAccessAllowed } = useContext(AccessPDFContext)
    const navigate = useNavigate()

    const viewECRPreview = () => {
        setAccessAllowed(true)
        navigate('/ecr_builder/ecr_preview')
    }

    useLayoutEffect(() => {
        document.body.style.backgroundColor = '#1C1B1F80'
    })

    return (
        <div id='ecrb-container'>
            <div className='ecrb-row'>
                <p className='ecrb-form-header-text'>{`Request Type: ${loading ? 'Loading...' : data.carrier}`}</p>
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
                { getRadioButtonWithText('With Cell Sites', 'ecrButton', false) }
                { getRadioButtonWithText('Without Cell Sites', 'ecrButton', true) }
            </div>
            <div className='ecrb-evenly-spaced-one-column-row'>
                { getCheckBoxWithText('SMS Detail - Incoming and outgoing text message detail to and from target phone. Includes time/date.') }
            </div>
            <div className='ecrb-row'>
                <button className='ecrb-solid-gray-button' onClick={viewECRPreview}>
                    Preview ECR...
                </button>
                <button id='ecrb-solid-blue-button'>
                    Send ECR
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
function getRadioButtonWithText(text: string, groupName: string, checked: boolean): JSX.Element {
    return (
        <div className='ecrb-radio-button-with-text'>
            <input className='ecrb-radio-button' type="radio" name={groupName} defaultChecked={checked}/>
            <p className='ecrb-radio-button-text'>{text}</p>
        </div>
    )
}



function getCaseNumber(): string {
    // TODO: We need to get this value from the backend
    return 'CF-123456789'
}
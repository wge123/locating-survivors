import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import './ecrBuilder.css'
import {useLocation, useNavigate} from 'react-router-dom'
import PropTypes from 'prop-types'
import AccessPDFContext from '../../context/accessPDFContext.tsx'

export default function ECRBuilderScreen(props) {
    const location = useLocation()
    const [checkedStates, setCheckedStates] = useState({})
    const phoneNumber = location.state?.phone_number || '4158586273'
    const [selectedDuration, setSelectedDuration] = useState(null)

    ECRBuilderScreen.propTypes = {
        user: PropTypes.object.isRequired
    }

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

    function getCheckBoxWithText(text: string, id: string): JSX.Element {
        useEffect(() => {
            setCheckedStates((prev) => ({ ...prev, [id]: false }))
        }, [id])

        return (
            <div className='ecrb-check-box-with-text'>
                <input className='ecrb-check-box'
                    type="checkbox"
                    checked={checkedStates[id] || false}
                    onChange={() => {
                        setCheckedStates((prev)=> ({
                            ...prev,
                            [id]: !prev[id]
                        }))
                    }}
                />
                <p className='ecrb-check-box-text'>{text}</p>
            </div>
        )
    }

    /*
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
     */
    const {user} = props

    function getCellPhoneNumber(phoneNumberString): string {
        const countryCode = phoneNumberString.substring(0, 1)
        const areaCode = phoneNumberString.substring(1, 4)
        const firstPart = phoneNumberString.substring(4, 7)
        const secondPart = phoneNumberString.substring(7, 11)
        return `+${countryCode} ${areaCode} ${firstPart}-${secondPart}`
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
        const userHash = {
            name: user.attributes.name,
            email: user.attributes.email
        }
        const date = getTodaysDate()

        navigate('/ecr_builder/ecr_preview', { state: { user: userHash, phoneNumber: getCellPhoneNumber(phoneNumber), date: date, checkedStates: checkedStates } })
    }

    const handleDurationSelect = (event) => {
        setSelectedDuration(event.target.value)
    }

    // Object { subInfo: false, locUpdates: false, historicalLocInfo: false, callDetail: false, precisionLoc: false }
    const handleECRPost = async () => {
        try {
            const response = await fetch('https://6u7yn5reri.execute-api.us-east-1.amazonaws.com/prod/ecr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'name': user.attributes.name,
                    'phone_number': phoneNumber,
                    'phone_provider': 'Sprint',
                    'case_id': 'tempvariableuntilakeenfix:)',
                    'email': user.attributes.email,
                    'subscriber_information': checkedStates['subInfo'],
                    'periodic_location_updates': checkedStates['locUpdates'],
                    'last_known_information': checkedStates['historicalLocInfo'],
                    'duration': selectedDuration,
                    'call_detail_with_sites': checkedStates['callDetail'],
                    'precision_location_of_device': checkedStates['precisionLoc']
                }),
            })
        } catch (error) {
            console.log(error)
        }
        console.log('hit')
    } 
    
    useLayoutEffect(() => {
        document.body.style.backgroundColor = '#1C1B1F80'
    })
    
    return (
        <div id='ecrb-container'>
            <div className='ecrb-row'>
                <p className='ecrb-form-header-text'>{`Request Type: ${'Sprint'}`}</p>
                <p className='ecrb-form-header-text'>{`Cell: ${getCellPhoneNumber(phoneNumber)}`}</p>
            </div>
            <div id='ecrb-first-row'>
                { getTextBoxWithLabel('Analyst Name', getUserDisplayName()) }
                { getTextBoxWithLabel('Case #', getCaseNumber()) }
            </div>
            <div id='ecrb-second-row'>
                { getTextBoxWithLabel('Date', getTodaysDate()) }
                { getTextBoxWithLabel('Email', getUserDisplayEmail()) }
            </div>
            <p className='ecrb-section-header-text'>
                Type of Records Being Requested
            </p>
            <div className='ecrb-evenly-spaced-two-column-row'>
                { getCheckBoxWithText('Subscriber Information', 'subInfo') }
                { getCheckBoxWithText('Periodic Location Updates (15 Minute Intervals)', 'locUpdates') }
            </div>
            <div className='ecrb-evenly-spaced-two-column-row'>
                { getCheckBoxWithText('Historical Location Information', 'historicalLocInfo') }
                <div id='ecrb-dropdown-with-text'>
                    <select id='ecrb-dropdown' onChange={handleDurationSelect}>
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
            <div className='ecrb-evenly-spaced-one-column-row'>
                { getCheckBoxWithText('Call Detail Records with cell site information. Includes time/date.', 'callDetail') }
            </div>
            <div className='ecrb-evenly-spaced-one-column-row'>
                { getCheckBoxWithText('Precision Location of mobile device', 'precisionLoc') }
            </div>
            <div className='ecrb-row'>
                <button className='ecrb-solid-gray-button' onClick={viewECRPreview}>
                    Preview ECR...
                </button>
                <button id='ecrb-solid-blue-button' onClick={handleECRPost}>
                    Send ECR
                </button>
            </div>
        </div>
    )
}

// TODO: Make this a separate component in a different file.
/*
function getRadioButtonWithText(text: string, groupName: string, checked: boolean): JSX.Element {
    return (
        <div className='ecrb-radio-button-with-text'>
            <input className='ecrb-radio-button' type="radio" name={groupName} defaultChecked={checked}/>
            <p className='ecrb-radio-button-text'>{text}</p>
        </div>
    )
}
*/


function getCaseNumber(): string {
    // TODO: We need to get this value from the backend
    return 'CF-123456789'
}
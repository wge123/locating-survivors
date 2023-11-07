import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import './ecrBuilder.css'
import {useLocation, useNavigate} from 'react-router-dom'
import PropTypes from 'prop-types'
import AccessPDFContext from '../../context/accessPDFContext.tsx'
import ClipLoader from 'react-spinners/ClipLoader'
import {fetchPdf} from '../../utils/fetchPdf.tsx'

export default function ECRBuilderScreen(props) {
    const location = useLocation()
    const [checkedStates, setCheckedStates] = useState({})
    const phoneNumber = location.state?.phone_number || '4158586273'
    const case_id = location.state?.itemId
    const [selectedDuration, setSelectedDuration] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const headers = {
        Authorization: `Bearer ${sessionStorage.getItem('idToken')}`,
        'Content-Type': 'application/json'
    }

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

    function getCheckBoxWithText(text: string, id: string, canDeselect: boolean): JSX.Element {
        const defaultCheckboxValue: boolean = canDeselect ? false : true
        const checkboxDisabled: boolean = canDeselect ? false : true
        const checkboxTextStyle: string = canDeselect ? 'ecrb-check-box-text' : 'ecrb-check-box-text-disabled'

        useEffect(() => {
            setCheckedStates((prev) => ({ ...prev, [id]: defaultCheckboxValue }))
        }, [id])

        return (
            <div className='ecrb-check-box-with-text'>
                <input className='ecrb-check-box'
                    type="checkbox"
                    checked={checkedStates[id] || defaultCheckboxValue}
                    onChange={() => {
                        setCheckedStates((prev)=> ({
                            ...prev,
                            [id]: !prev[id]
                        }))
                    }}
                    disabled={checkboxDisabled}
                />
                <p className={checkboxTextStyle}>{text}</p>
            </div>
        )
    }

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
    const userHash = {
        name: user.attributes.name,
        email: user.attributes.email
    }
    const date = getTodaysDate()
    const state= { user: userHash, phoneNumber: getCellPhoneNumber(phoneNumber), date: date, checkedStates: checkedStates }
    const viewECRPreview = () => {
        setAccessAllowed(true)
        const newWindow = window.open('/ecr_builder/ecr_preview')
        const ecrData= ''
        newWindow[ecrData] = { state }
    }

    const handleDurationSelect = (event) => {
        setSelectedDuration(event.target.value)
    }

    function getCaseNumber(): string {
        return case_id
    }

    // Object { subInfo: false, locUpdates: false, historicalLocInfo: false, callDetail: false, precisionLoc: false }
    const [pdfUrl, setPdfUrl] = useState('')
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
    const handleECRPost = async () => {
        setIsLoading(true)
        try {
            const { pdfUrl, pdfBlob } = await fetchPdf(state)
            setPdfUrl(pdfUrl)
            setPdfBlob(pdfBlob)

            const convertToBase64 = (blob) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(blob)
                    reader.onloadend = function () {
                        const base64data = reader.result.split(',')[1]
                        resolve(base64data)
                    }
                    reader.onerror = function (error) {
                        reject(error)
                    }
                })
            }

            const base64data = await convertToBase64(pdfBlob)

            const pdf_response = await fetch('https://6u7yn5reri.execute-api.us-east-1.amazonaws.com/prod/s3/files', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    'blob': base64data,
                    'fileName': case_id
                }),
            })

            if (pdf_response.status === 200) {
                const ecr_post_response = await fetch('https://6u7yn5reri.execute-api.us-east-1.amazonaws.com/prod/ecr', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        'name': user.attributes.name,
                        'phone_number': phoneNumber,
                        'phone_provider': 'Sprint',
                        'case_id': case_id,
                        'email': user.attributes.email,
                        'subscriber_information': checkedStates['subInfo'],
                        'periodic_location_updates': checkedStates['locUpdates'],
                        'last_known_information': checkedStates['historicalLocInfo'],
                        'duration': selectedDuration,
                        'call_detail_with_sites': checkedStates['callDetail'],
                        'precision_location_of_device': checkedStates['precisionLoc']
                    }),
                })
                const ecr_post_result = await ecr_post_response.json()
                if ( ecr_post_result.statusCode === 200) {
                    const email_handler_response = await fetch('https://6u7yn5reri.execute-api.us-east-1.amazonaws.com/prod/email', {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({
                            'name': user.attributes.name,
                            'phone_number': phoneNumber,
                            'case_id': case_id,
                            'duration': selectedDuration.toString(),
                            'interval': (checkedStates['locUpdates']).toString()
                        })
                    })
                    const email_handler_result = await email_handler_response.json()
                    if ( email_handler_result.statusCode === 200) {
                        navigate('/case_list')
                    } else {
                        console.error(email_handler_result)
                    }
                } else {
                    // we should have some component that we can reuse
                    // here we'd set the flash error to true
                    // pass some props to it the component int he rendered html and add it to the top for x seconds
                    console.error(ecr_post_result)
                }
            } else {
                console.error(pdf_response)
            }
            

        } catch (error) {
            console.log(error)
            setIsLoading(false)
            navigate('/case_list')
        }
        setIsLoading(false)
    } 
    
    useLayoutEffect(() => {
        document.body.style.backgroundColor = '#1C1B1F80'
        return () => {
            document.body.style.backgroundColor = '' // Reset to default or another color
        }
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
                { getCheckBoxWithText('Subscriber Information', 'subInfo', true) }
                { getCheckBoxWithText('Periodic Location Updates (15 Minute Intervals)', 'locUpdates', false) }
            </div>
            <div className='ecrb-evenly-spaced-two-column-row'>
                { getCheckBoxWithText('Historical Location Information', 'historicalLocInfo', true) }
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
                { getCheckBoxWithText('Call Detail Records with cell site information. Includes time/date.', 'callDetail', true) }
            </div>
            <div className='ecrb-evenly-spaced-one-column-row'>
                { getCheckBoxWithText('Precision Location of mobile device', 'precisionLoc', false) }
            </div>
            <div className='ecrb-row'>
                <button className='ecrb-solid-gray-button' onClick={viewECRPreview}>
                        Preview ECR...
                </button>
                <button id='ecrb-solid-blue-button' onClick={handleECRPost}>
                    Send ECR
                </button>
            </div>

            {isLoading && (
                <div className="loading-overlay">
                    <ClipLoader />
                </div>
            )}
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

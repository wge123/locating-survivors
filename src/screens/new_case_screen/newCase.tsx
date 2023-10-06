import React, {useEffect, useState} from 'react'
import './newCase.css'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { BrowserRouter as Router, Route, Link, useNavigate} from 'react-router-dom'
import PropTypes from 'prop-types'
import ClipLoader from 'react-spinners/ClipLoader'

export default function NewCaseScreen(props) {
    NewCaseScreen.propTypes = {
        user: PropTypes.object.isRequired
    }

    const [phone_number, setPhone] = useState('')
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const {user} = props
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    function handlePhoneInput(phone_number) {
        setPhone(phone_number)
        if (phone_number.length === 11) {
            setIsButtonDisabled(false)
        } else {
            setIsButtonDisabled(true)
        }
    }

    const handleCasePost = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('https://6u7yn5reri.execute-api.us-east-1.amazonaws.com/prod/case', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: user.attributes.name,
                    phone_number: phone_number,
                    user_id: user.attributes.sub
                }),
            })

            const result = await response.json()
            if ( result.statusCode === 200) {
                navigate('/ecr_builder', {state: {phone_number: phone_number}})
            } else {
                // we should have some componenet that we can reuse
                // here we'd set the flash error to true
                // pass some props to it the componenet int he rendered html and add it to the top for x seconds
                console.error(result)
            }
        } catch (error) {
            console.error('Error posting data: ', error)
        }
        setIsLoading(false)
    }

    return (
        <div id='nc-container'>
            <div id='nc-center-pane'>
                <div id='nc-header-box'>
                    <p id='nc-header-text'>
                        New Case...
                    </p>
                </div>
                <div id='nc-phone-input-container'>
                    <PhoneInput disableDropdown country={'us'} value={phone_number} onChange={phone => handlePhoneInput(phone)} />
                </div>
                <div id='nc-button-container'>
                    <button id='nc-build-ecr-button' disabled={isButtonDisabled} onClick={handleCasePost}>
                        Build ECR...
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="loading-overlay">
                    <ClipLoader />
                </div>
            )}
        </div>
    )
}
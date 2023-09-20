import React, {useEffect, useState} from 'react'
import './newCase.css'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { BrowserRouter as Router, Route, Link, useNavigate} from 'react-router-dom'
import PropTypes from 'prop-types'

export default function NewCaseScreen(props) {
    NewCaseScreen.propTypes = {
        user: PropTypes.object.isRequired
    }

    const [phone_number, setPhone] = useState('')
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const {user} = props
    const navigate = useNavigate()

    function handlePhoneInput(phone_number) {
        setPhone(phone_number)
        if (phone_number.length === 11) {
            setIsButtonDisabled(false)
        } else {
            setIsButtonDisabled(true)
        }
    }

    const handleCasePost = async () => {
        try {
            const response = await fetch('https://y2r550iewh.execute-api.us-east-1.amazonaws.com/use_this_one/case/user_id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // not sure difference of phgone number & cell number
                body: JSON.stringify({
                    //cell_number: phone_number.replace(/-/g, ''),
                    name: user.attributes.name,
                    phonenumber: phone_number,
                    user_id: user.attributes.sub
                }),
            })
            const result = await response.json()
            navigate('/ecr_builder', { state: { phone_number: phone_number } })
            console.log(response)
        } catch (error) {
            console.error('Error posting data: ', error)
        }
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
        </div>
    )
}
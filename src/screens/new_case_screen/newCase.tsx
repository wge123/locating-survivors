import React, {useState}from 'react'
import './newCase.css'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'


export default function NewCaseScreen() {
    const [phone, setPhone] = useState('')
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)

    function handlePhoneInput(phone) {
        setPhone(phone)
        if (phone.length === 11) {
            setIsButtonDisabled(false)
        } else {
            setIsButtonDisabled(true)
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
                    <PhoneInput disableDropdown country={'us'} value={phone} onChange={phone => handlePhoneInput(phone)} />
                </div>
                <div id='nc-button-container'>
                    <button id='nc-build-ecr-button' disabled={isButtonDisabled} >
                        <Link to="/ecr_builder"  style={{textDecoration: 'none'}} state={{ phone_number: phone }}>
                                Build ECR...
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}
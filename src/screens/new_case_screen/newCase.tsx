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
        <div id='new-case-container'>
            <div id='new-case-center-pane'>
                <div id='new-case-header-box'>
                    <p id='new-case-header-text'>
                        New Case...
                    </p>
                </div>
                <div id='new-case-phone-input-container'>
                    <PhoneInput disableDropdown country={'us'} value={phone} onChange={phone => handlePhoneInput(phone)} />
                </div>
                <div id='new-case-button-container'>
                    <button id='build-ecr-button-new-case' disabled={isButtonDisabled} >
                        <Link to="/ecr_builder"  style={{textDecoration: 'none'}} state={{ phone_number: phone }}>
                                Build ECR...
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}
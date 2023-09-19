import React, {useEffect, useState} from 'react'
import './newCase.css'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { BrowserRouter as Router, Route, Link, useLocation} from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'


export default function NewCaseScreen() {
    const [phone_number, setPhone] = useState('')
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const location = useLocation()
    const user = location.state?.user

    function handlePhoneInput(phone_number) {
        setPhone(phone_number)
        if (phone_number.length === 11) {
            setIsButtonDisabled(false)
        } else {
            setIsButtonDisabled(true)
        }
    }

    const handleCasePost = async () => {
        const currentDate = new Date().toISOString()
        try {
            const response = await fetch('https://y2r550iewh.execute-api.us-east-1.amazonaws.com/use_this_one/case/user_id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    __typename: 'Case',
                    _lastChangedAt: currentDate,
                    _version: 1,
                    cell_number: phone_number.replace(/-/g, ''),
                    createdAt: currentDate,
                    name: user?.name,
                    phonenumber: phone_number,
                    updatedAt: currentDate,
                    user_id: user?.id,
                    id: uuidv4()
                }),
            })
            const result = await response.json()
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
                        <Link to="/ecr_builder"  style={{textDecoration: 'none'}} state={{ phone_number: phone_number }}>
                                Build ECR...
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}
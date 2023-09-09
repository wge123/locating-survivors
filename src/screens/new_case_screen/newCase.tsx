import React, {useState} from 'react'
import './newCase.css'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
export default function NewCaseScreen() {
    const [phone, setPhone] = useState('')

    return (
        <div id='new-case-container'>
            <div id='new-case-center-pane'>
                <div id='new-case-header-box'>
                    <p id='new-case-header-text'>
                        New Case...
                    </p>
                </div>
                <div id='new-case-phone-input-container'>
                    <PhoneInput country={'us'} value={phone} onChange={phone => setPhone(phone)} />
                </div>
                <div id='new-case-button-container'>
                    <Link to="/screens/login_screen">
                        <button id='build-ecr-button-new-case'>
                            Build ECR...
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

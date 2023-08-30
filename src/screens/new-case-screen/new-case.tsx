import React, {useState} from 'react'
import './new-case.css'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

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
                <PhoneInput country={'us'} value={phone} onChange={phone => setPhone(phone)} />
                <div id='new-case-button-container'>
                    <button id='build-ecr-button-new-case' onClick={() => onBuildButtonClick()}>
                        Build ECR...
                    </button>
                </div>
            </div>
        </div>
    )
}

function onBuildButtonClick() {
    //TODO: Implement
    return
}
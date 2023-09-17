import React, {useState} from 'react'
import './newCase.css'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export default function NewCaseScreen() {
    const [phone, setPhone] = useState('')

    return (
        <div id='nc-container'>
            <div id='nc-center-pane'>
                <div id='nc-header-box'>
                    <p id='nc-header-text'>
                        New Case...
                    </p>
                </div>
                <div id='nc-phone-input-container'>
                    <PhoneInput country={'us'} value={phone} onChange={phone => setPhone(phone)} />
                </div>
                <div id='nc-button-container'>
                    <button id='nc-build-ecr-button' onClick={() => onBuildButtonClick()}>
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
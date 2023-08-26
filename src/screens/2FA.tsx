import React from 'react'
import './2FA.css'

export default function TwoFactorAuthenticationScreen() {
    return (
        <div id='container2FA'>
            <div id='centerPane2FA'>
                <p id='headerText2FA'>
                    2FA
                </p>
                <p id='subText2FA'>
                    A code has been sent to ###ple@uscg.sarcfs.gov for verification
                </p>
                <input id='textInput2FA' placeholder='2FA Code...' type='text'/>
                <div id='verifyButtonContainer2FA'>
                    <button id='verifyButton2FA' onClick={() => onVerifyButtonClick()}>
                        Verify
                    </button>
                </div>
            </div>
        </div>
    )
}

function onVerifyButtonClick() {
    // TODO: Not yet implemented.
    return
}
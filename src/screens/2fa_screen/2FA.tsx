import React from 'react'
import './2FA.css'

export default function TwoFactorAuthenticationScreen() {
    return (
        <div id='container-2FA'>
            <div id='center-pane-2FA'>
                <p id='header-text-2FA'>
                    2FA
                </p>
                <p id='sub-text-2FA'>
                    A code has been sent to ###ple@uscg.sarcfs.gov for verification
                </p>
                <input id='text-input-2FA' placeholder='2FA Code...' type='text'/>
                <div id='verify-button-container-2FA'>
                    <button id='verify-button-2FA' onClick={() => onVerifyButtonClick()}>
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
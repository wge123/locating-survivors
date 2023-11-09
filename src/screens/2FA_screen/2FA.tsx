import { Auth, Hub } from 'aws-amplify'
import React, { useState } from 'react'
import './2FA.css'
import ErrorSnackbar from '../../components/errorSnackbar'

interface twoFactorAuthenticationProps {
    authResponse: object
}

export default function TwoFactorAuthenticationScreen(props: twoFactorAuthenticationProps) {
    const [mfaCode, setMfaCode] = useState('')
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)

    const onVerifyButtonClick = async () => {
        try {
            // Confirm the 2FA code that the user typed in.
            const mfaResponse = await Auth.confirmSignIn(props.authResponse, mfaCode, 'SOFTWARE_TOKEN_MFA')
            console.log('User authenticated with 2FA.')
            if (mfaResponse) {
                Auth.currentAuthenticatedUser()
                    .then(user => {
                        const attributes = user.attributes
                        Hub.dispatch('auth', { event: mfaResponse , attributes })
                    })
                    .catch(err => console.log(err))
            }
        } catch (error) {
            console.log('User authentication attempt WITH 2FA failed. ' + error)
            setOpenErrorSnackbar(true)
        }
    }
    
    return (
        <div id='container-2FA'>
            <div id='center-pane-2FA'>
                <p id='header-text-2FA'>
                    2FA
                </p>
                <p id='sub-text-2FA'>
                    Please enter the code from your authenticator app for verification
                </p>
                <input id='text-input-2FA' placeholder='2FA Code...' type='text' onChange={event => setMfaCode(event.target.value)}/>
                <div id='verify-button-container-2FA'>
                    <button id='verify-button-2FA' onClick={() => onVerifyButtonClick()}>
                        Verify
                    </button>
                </div>
            </div>
            <ErrorSnackbar errorMessage='Incorrect 2FA code.' open={openErrorSnackbar} onClose={() => setOpenErrorSnackbar(false)}/>
        </div>
    )
}
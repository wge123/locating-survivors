import { Auth } from 'aws-amplify'
import React, { useState } from 'react'
import './login.css'
import ErrorSnackbar from '../../components/errorSnackbar'
import TwoFactorAuthenticationScreen from '../2FA_screen/2FA'

export default function LoginScreen() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)
    const [authResponse, setAuthresponse] = useState(null)

    const handleLoginAttempt = async () => {
        try {
            const response = await Auth.signIn(username, password)
            console.log('User authentication response: ', response)
            setAuthresponse(response)
        } catch (error) {
            console.log('User authentication attempt failed. ' + error)
            setOpenErrorSnackbar(true)
        }
    }

    return (
        authResponse == null ?
            <div id='l-container'>
                <div id='l-center-pane'>
                    <p id='l-header-text'>
                        Search and Rescue Cellular Forensics Service
                    </p>
                    <input className='l-text-input' placeholder='Username...' type='text' onChange={event => setUsername(event.target.value)} />
                    <input className='l-text-input' placeholder='Password...' type='password' onChange={event => setPassword(event.target.value)} />
                    {/* TODO: The "forgot passowrd" button is hidden for the MVP. Functionality for it will be implemented as a nice-to-have. */}
                    {/* <button id='l-forgot-password-button' onClick={() => onForgotPasswordButtonClick()}>
                        Forgot Password...
                    </button> */}
                    <button id='l-login-button' onClick={() => handleLoginAttempt()}>
                        Login
                    </button>
                </div>
                <ErrorSnackbar errorMessage='Incorrect username and/or password.' open={openErrorSnackbar} onClose={() => setOpenErrorSnackbar(false)}/>
            </div> :
            <TwoFactorAuthenticationScreen authResponse={authResponse} />
    )
}

function onForgotPasswordButtonClick() {
    // TODO: Not yet implemented.
    return
}
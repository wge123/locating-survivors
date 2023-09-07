import { Auth } from 'aws-amplify'
import React, { useState } from 'react'
import './login.css'

export default function LoginScreen() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLoginAttempt = async () => {
        try {
            const response = await Auth.signIn(username, password)
            console.log('User authentication response: ', response)
        } catch (error) {
            console.log('User authentication attempt failed. ' + error)
        }
    }

    return (
        <div id='container'>
            <div id='center-pane'>
                <p id='header-text'>
                    Search and Rescue Cellular Forensics Service
                </p>
                <input className='text-input' placeholder='Username...' type='text' onChange={event => setUsername(event.target.value)} />
                <input className='text-input' placeholder='Password...' type='password' onChange={event => setPassword(event.target.value)} />
                <button id='forgot-password-button' onClick={() => onForgotPasswordButtonClick()}>
                    Forgot Password...
                </button>
                <button id='login-button' onClick={() => handleLoginAttempt()}>
                    Login
                </button>
            </div>
        </div>
    )
}

function onForgotPasswordButtonClick() {
    // TODO: Not yet implemented.
    return
}
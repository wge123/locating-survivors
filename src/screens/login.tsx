import React from 'react'
import './login.css'

export default function LoginScreen() {
    return (
        <div id='container'>
            <div id='center-pane'>
                <p id='header-text'>
                    Search and Rescue Cellular Forensics Service
                </p>
                <input className='text-input' placeholder='Username...' type='text'/>
                <input className='text-input' placeholder='Password...' type='password'/>
                <button id='forgot-password-button' onClick={() => onForgotPasswordButtonClick()}>
                    Forgot Password...
                </button>
                <button id='login-button' onClick={() => onLoginButtonClick()}>
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

function onLoginButtonClick() {
    // TODO: Not yet implemented.
    return
}
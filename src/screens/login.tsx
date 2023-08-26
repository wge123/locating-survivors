import React from 'react'
import './login.css'

export default function LoginScreen() {
    return (
        <div id='container'>
            <div id='centerPane'>
                <p id='headerText'>
                    Search and Rescue Cellular Forensics Service
                </p>
                <input className='textInput' placeholder='Username...' type='text'/>
                <input className='textInput' placeholder='Password...' type='password'/>
                <button id='forgotPasswordButton' onClick={() => onForgotPasswordButtonClick()}>
                    Forgot Password...
                </button>
                <button id='loginButton' onClick={() => onLoginButtonClick()}>
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
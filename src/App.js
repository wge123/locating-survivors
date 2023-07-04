import { withAuthenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify' //provisions front end to speak with back end
import React from 'react'
import './App.css'
import config from './aws-exports'

Amplify.configure(config)

function App() {
    return (
        <div className="App">
            <header className="App-header">
                hello
            </header>
        </div>
    )
}

export default withAuthenticator(App)
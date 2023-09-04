import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import React from 'react'
import '@aws-amplify/ui-react/styles.css'
import config from './aws-exports'
import Login from './screens/login.tsx'

Amplify.configure(config)



export default function App() {
    return (
        <Login />
    )
}
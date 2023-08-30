import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import React from 'react'
import '@aws-amplify/ui-react/styles.css'
import config from './aws-exports'
import NewCaseScreen from './screens/new-case-screen/new-case'

Amplify.configure(config)



export default function App() {
    return(
        <NewCaseScreen/>
    )
}
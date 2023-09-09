import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import React from 'react'
import '@aws-amplify/ui-react/styles.css'
import config from './aws-exports'
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom'
import NewCaseScreen from './screens/new_case_screen/newCase'


Amplify.configure(config)



export default function App() {
    return(
        <Router>
            <Routes>
                <Route path="/new_case" element={<NewCaseScreen/>} />
                {/* ... other routes ... */}
            </Routes>
        </Router>
    )
}
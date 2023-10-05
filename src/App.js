import '@aws-amplify/ui-react/styles.css'
import { Amplify, Hub } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import awsExports from './aws-exports'
import ECRBuilderScreen from './screens/ECR_builder_screen/ecrBuilder'
import CaseListScreen from './screens/case_list_screen/caseList'
import CaseViewScreen from './screens/case_view_screen/caseView'
import LoginScreen from './screens/login_screen/login'
import NewCaseScreen from './screens/new_case_screen/newCase'

Amplify.configure(awsExports)

// If we add admin panel we need more routes here, probably sub routes
// ecrbuilder route might need to be private and only receive user context from componenets through navigation but idk yet
// tbqh we should use React context to grab the user info but this is ok for now
export default function App() {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        Hub.listen('auth', (event) => {
            console.log('auth event', event)
            const cognitoUser = event.payload.data
            setCurrentUser(cognitoUser)
        })
    })

    return (
        currentUser != null ?
            <Router>
                <Routes>
                    <Route path="*" element={<CaseListScreen user={currentUser}/>} />
                    <Route path="/new_case" element={<NewCaseScreen user={currentUser} />}/>
                    <Route path="/case_view" element={<CaseViewScreen user={currentUser}/>}/>
                    <Route path="/ecr_builder" element={<ECRBuilderScreen user={currentUser}/>}/>
                    <Route path="/case_list" element={<CaseListScreen user={currentUser}/>} />
                </Routes>
            </Router> :
            <LoginScreen />
    )
}
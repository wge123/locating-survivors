import '@aws-amplify/ui-react/styles.css'
import { Amplify, Hub } from 'aws-amplify'
import { default as React, useEffect, useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import awsExports from './aws-exports'
import AccessPDFContext from './context/accessPDFContext'
import AccessCaseViewContext from './context/accessCaseViewContext'
import ECRBuilderScreen from './screens/ECR_builder_screen/ecrBuilder'
import EcrPreview from './screens/ECR_builder_screen/ecrPreview'
import CaseListScreen from './screens/case_list_screen/caseList'
import CaseViewScreen from './screens/case_view_screen/caseView'
import LoginScreen from './screens/login_screen/login'
import NewCaseScreen from './screens/new_case_screen/newCase'
import { CognitoUser } from 'amazon-cognito-identity-js'


Amplify.configure(awsExports)

// If we add admin panel we need more routes here, probably sub routes
// ecrbuilder route might need to be private and only receive user context from componenets through navigation but idk yet
// tbqh we should use React context to grab the user info but this is ok for now
export default function App() {
    const persistedUser = JSON.parse(sessionStorage.getItem('user'))
    const [accessAllowed, setAccessAllowed] = useState(false)
    const [accessToCaseView, setAccessToCaseView] = useState(false)
    const [user, setUser] = useState(persistedUser)

    useEffect(() => {
        Hub.listen('auth', (event) => {
            console.log('auth event', event)
            const userAttributes = event.payload
            const userData = event.payload.event
            if (userData instanceof CognitoUser) {
                // retrieve the user token
                const idToken = userData.getSignInUserSession().getIdToken().getJwtToken()
                setUser(userAttributes)
                // Save the user to session storage so that the user is still logged-in if they refresh the page.
                sessionStorage.setItem('user', JSON.stringify(userAttributes))
                sessionStorage.setItem('idToken', idToken)

            }

        })
    })


    return (
        user != null ?
            <AccessCaseViewContext.Provider value={{ accessToCaseView, setAccessToCaseView }}>
                <AccessPDFContext.Provider value={{ accessAllowed, setAccessAllowed }}>
                    <Router>
                        <Routes>
                            <Route path="*" element={<CaseListScreen user={user} />} />
                            <Route path="/new_case" element={<NewCaseScreen user={user} />} />
                            <Route path="/case_detail" element={<CaseViewScreen user={user} />} />
                            <Route path="/ecr_builder" element={<ECRBuilderScreen user={user} />} />
                            <Route path="/ecr_builder/ecr_preview" element={<EcrPreview />} />
                            <Route path="/case_list" element={<CaseListScreen user={user} />} />
                        </Routes>
                    </Router>
                </AccessPDFContext.Provider>
            </AccessCaseViewContext.Provider> :
            <LoginScreen />
    )
}
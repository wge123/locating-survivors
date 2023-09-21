import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import React from 'react'
import '@aws-amplify/ui-react/styles.css'
import config from './aws-exports'
import NewCaseScreen from './screens/new_case_screen/newCase'
import CaseListScreen from './screens/case_list_screen/caseList'
import CaseViewScreen from './screens/case_view_screen/caseView'
import ECRBuilderScreen from './screens/ECR_builder_screen/ecrBuilder'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

Amplify.configure(config)

// If we add admin panel we need more routes here, probably sub routes
// ecrbuilder route might need to be private and only receive user context from componenets through navigation but idk yet
// tbqh we should use React context to grab the user info but this is ok for now
export default function App() {
    return(
        <Authenticator>
            {({  user }) => (
                <Router>
                    <Routes>
                        <Route path="*" element={<CaseListScreen user={user}/>} />
                        <Route path="/new_case" element={<NewCaseScreen user={user} />}/>
                        <Route path="/case_view" element={<CaseViewScreen user={user}/>}/>
                        <Route path="/ecr_builder" element={<ECRBuilderScreen user={user}/>}/>
                        <Route path="/case_list" element={<CaseListScreen user={user}/>} />
                    </Routes>
                </Router>
            )}
        </Authenticator>
    )
}
import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import React from 'react'
import '@aws-amplify/ui-react/styles.css'
import config from './aws-exports'
import NewCaseScreen from './screens/new_case_screen/newCase'
import CaseListScreen from './screens/case_list_screen/caseListScreen'
import CaseDetailScreen from './screens/case_detail_screen/caseDetailScreen'
import ECRBuilderScreen from './screens/ECR_builder_screen/ecrBuilder'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

Amplify.configure(config)


// If we add admin panel we need more routes here, probably sub routes
export default function App() {
    return(
        <Authenticator>
            <Router>
                <Routes>
                    <Route path="*" element={<CaseListScreen />} />
                    <Route path="/new_case" element={<NewCaseScreen />} />
                    <Route path="/case_detail" element={<CaseDetailScreen />}/>
                    <Route path="/ecr_builder" element={<ECRBuilderScreen />}/>
                    <Route path="/case_list" element={<CaseListScreen />} />
                </Routes>
            </Router>
        </Authenticator>
    )
}
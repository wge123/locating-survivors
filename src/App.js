import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import React, {useState} from 'react'
import '@aws-amplify/ui-react/styles.css'
import config from './aws-exports'
import NewCaseScreen from './screens/new_case_screen/newCase'
import CaseListScreen from './screens/case_list_screen/caseList'
import CaseViewScreen from './screens/case_view_screen/caseView'
import ECRBuilderScreen from './screens/ECR_builder_screen/ecrBuilder'
import EcrPreview from './screens/ECR_builder_screen/ecrPreview'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AccessPDFContext from './context/accessPDFContext'
import AccessCaseViewContext from './context/accessCaseViewContext'


Amplify.configure(config)

// If we add admin panel we need more routes here, probably sub routes
// ecrbuilder route might need to be private and only receive user context from componenets through navigation but idk yet
// tbqh we should use React context to grab the user info but this is ok for now
export default function App() {
    const [accessAllowed, setAccessAllowed] = useState(false)
    const [accessToCaseView, setAccessToCaseView] = useState(false)
    return(
        <Authenticator>
            {({  user }) => (
                <AccessCaseViewContext.Provider value={{ accessToCaseView, setAccessToCaseView }}>
                    <AccessPDFContext.Provider value={{ accessAllowed, setAccessAllowed }}>
                        <Router>
                            <Routes>
                                <Route path="*" element={<CaseListScreen user={user}/>} />
                                <Route path="/new_case" element={<NewCaseScreen user={user} />}/>
                                <Route path="/case_detail" element={<CaseViewScreen user={user}/>}/>
                                <Route path="/ecr_builder" element={<ECRBuilderScreen user={user}/>}/>
                                <Route path="/ecr_builder/ecr_preview" element={<EcrPreview />} />
                                <Route path="/case_list" element={<CaseListScreen user={user}/>} />
                            </Routes>
                        </Router>
                    </AccessPDFContext.Provider>
                </AccessCaseViewContext.Provider>
            )}
        </Authenticator>
    )
}
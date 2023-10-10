import React, {useEffect, useState} from 'react'
import './caseList.css'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import {useLocation, useNavigate} from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'

// This is NOT a model for an actual case from the backend. 
// This is simply the information we need for displaying the case on the frontend. 
// We should fill these parameters with data that we GET from the backend.
interface CaseForDisplay {
    lastUpdate: string,
    status: string,
    duration: string
}

export default function CaseListScreen(props): JSX.Element {
    const [cases, setCases] = useState([])
    const [case_data_arr, set_case_data] = useState([])
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    CaseListScreen.propTypes = {
        user: PropTypes.object.isRequired
    }

    const {user} = props

    useEffect(() => {
        // Assuming getCases is the function you defined to fetch data
        const fetchData = async () => {
            const fetchedCases = await getCases()
            setCases(fetchedCases[0])
            set_case_data(fetchedCases[1])
        }

        fetchData()
    }, [])

    // TODO: We need to modify this function to retrieve cases from the backend, and then fit that data to our "CaseForDisplay" UI model so that we may display those cases on the frontend.
    // NOTE: The UI has already been tested with mock data using the "CaseForDisplay" model.
    async function getCases(): Promise<(CaseForDisplay[] | any[])[]> {
        setIsLoading(true)
        const userID = user.attributes.sub
        const url = `https://6u7yn5reri.execute-api.us-east-1.amazonaws.com/prod/case?user_id=${userID}`
        const case_arr: CaseForDisplay[] = []
        const case_data_arr = []
        try{
            const response = await fetch(url)
            const data = await response.json()
            data.data.forEach(function(user_case: any) {
                const display_case: CaseForDisplay = {
                    lastUpdate: moment(user_case.time_updated).tz('America/New_York').format('lll'),
                    status: user_case.status? user_case.status : 'Open',
                    duration: user_case.duration
                }
                case_arr.push(display_case)
                case_data_arr.push(user_case)
            })
        }catch (error) {
            console.log('Error: ',error)
        }
        setIsLoading(false)
        return [case_arr ,case_data_arr]
    }

    function getUserFullName(): string {
        return user.attributes.name
    }

    function navigateToViewCaseScreen(key) {
        navigate('/case_detail  ')
    }

    function getCaseItem(key: number, lastUpdate: string, status: string, duration: string): JSX.Element {
        return (
            <div id='cl-ci-container' key={key}>
                <div id='cl-ci-left-pane'>
                    <p id='cl-cit-left-align' className='cl-ci-text'>{`Last Update: ${lastUpdate}`}</p>
                    <p id='cl-cit-left-align' className='cl-ci-text'>{`Status: ${status}`}</p>
                </div>
                <div id='cl-ci-middle-pane'>
                    <p id='cl-cit-center-align' className='cl-ci-text'>{`Duration: ${duration}`}</p>
                </div>
                <div id='cl-ci-right-pane'>
                    <button id='cl-ci-top-button' onClick={() => exportCase(key)}>Export...</button>
                    <button id='cl-ci-bottom-button' onClick={() => navigateToViewCaseScreen(key)}>View...</button>
                </div>
            </div>
        )
    }

    function navigateToNewCaseScreen() {
        navigate('/new_case')
    }

    function exportCase(index) {
        // Generate CSV header
        const header = Object.keys(case_data_arr[index]).join(',')

        const row = Object.values(case_data_arr[index]).join(',')

        const caseId = case_data_arr[index].id

        // Combine header and row
        const csvContent = header + '\n' + row

        // Create a Blob with the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

        // Create and click a hidden link to trigger the download
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `case_${caseId}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div id='cl-container'>
            <div id='cl-left-pane'>
                <p id='cl-lp-header-text'>Sort By...</p>
                {getRadioButtonWithText('Show Active Only')}
                {getRadioButtonWithText('Duration (d)')}
                {getRadioButtonWithText('Duration (a)')}
                <div id='cl-user-info-box'>
                    <p className='cl-uib-text'>{getUserFullName()}</p>
                    <p className='cl-uib-text'>Operator</p>
                </div>
            </div>
            <div id='cl-main-content'>
                {cases.map((caseForDisplay, index) => (
                    <>
                        {getCaseItem(index, caseForDisplay.lastUpdate, caseForDisplay.status, caseForDisplay.duration)}
                    </>
                ))}
                <button id='cl-mc-bottom-button' onClick={() => navigateToNewCaseScreen()}>New Case...</button>
            </div>
            {isLoading && (
                <div className="loading-overlay">
                    <ClipLoader />
                </div>
            )}
        </div>
    )
}

function getRadioButtonWithText(text: string): JSX.Element {
    return (
        <div id='cl-radio-button-with-text'>
            <input id='cl-radio-button' name='clRadioButton' type="radio" />
            <p id='cl-radio-button-text'>{text}</p>
        </div>
    )
}

function getUserRole(): string {
    // "Operator" is the default role.
    // TODO: We need to get this value from the backend.
    return 'Operator'
}

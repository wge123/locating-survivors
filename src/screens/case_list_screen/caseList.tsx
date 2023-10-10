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
    const [showActiveOnly, setShowActiveOnly] = useState(true)
    const [sortOrder, setSortOrder] = useState('none') // none, lowToHigh, highToLow
    const [initialCaseTimes, setInitialCaseTimes] = useState({})

    CaseListScreen.propTypes = {
        user: PropTypes.object.isRequired
    }

    const {user} = props

    useEffect(() => {
        const fetchData = async () => {
            const fetchedCases = await getCases()
            setCases(fetchedCases[0])
            set_case_data(fetchedCases[1])
        }

        fetchData()
    }, [])


    function formattedDuration(createdAt) {
        const currentTime = new Date() // Current time
        const milliseconds = currentTime.getTime() - createdAt.getTime()
        const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000))
        const hours = Math.floor((milliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
        return `${days}:${hours}`
    }

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
                const createdAt = new Date(user_case._createdAt)
                initialCaseTimes[user_case.id] = createdAt
                const formattedDifference = formattedDuration(createdAt)
                const display_case: CaseForDisplay = {
                    lastUpdate: moment(user_case.time_updated).tz('America/New_York').format('lll'),
                    // TODO: AKEEN - once we figure out how status works fix this
                    status: user_case.status? user_case.status : 'Open',
                    duration: formattedDifference
                }
                case_arr.push(display_case)
                case_data_arr.push(user_case)
            })
            setInitialCaseTimes(initialCaseTimes)
        }catch (error) {
            console.log('Error: ',error)
        }
        setIsLoading(false)
        return [case_arr ,case_data_arr]
    }

    function getUserFullName(): string {
        return user.attributes.name
    }

    function navigateToViewCaseScreen() {
        navigate('/case_detail')
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

    function getCheckboxForActiveOnly(): JSX.Element {
        return (
            <div id='cl-radio-button-with-text'>
                <input
                    id='cl-radio-button'
                    name='clCheckbox'
                    type="checkbox"
                    checked={showActiveOnly}
                    onClick={() => setShowActiveOnly(!showActiveOnly)}
                />
                <p id='cl-radio-button-text'>Show Active Only</p>
            </div>
        )
    }

    function handleSortOrderChange(order: string) {
        setSortOrder(order)
    }

    function getRadioButtonWithText(text: string): JSX.Element {
        return (
            <div id='cl-radio-button-with-text'>
                <input
                    id='cl-radio-button'
                    name='clRadioButton'
                    type="radio"
                    onClick={() => handleSortOrderChange(text)}
                />
                <p id='cl-radio-button-text'>{text}</p>
            </div>
        )
    }

    return (
        <div id='cl-container'>
            <div id='cl-left-pane'>
                <p id='cl-lp-header-text'>Sort By...</p>
                {getCheckboxForActiveOnly()}
                {getRadioButtonWithText('Duration: Low to High')}
                {getRadioButtonWithText('Duration: High to Low')}
                <div id='cl-user-info-box'>
                    <p className='cl-uib-text'>{getUserFullName()}</p>
                    <p className='cl-uib-text'>Operator</p>
                </div>
            </div>
            <div id='cl-main-content'>
                {cases
                    .filter(caseForDisplay => !showActiveOnly || caseForDisplay.status === 'Open')
                    .sort((a, b) => {
                        if (sortOrder === 'Duration: Low to High') {
                            return parseInt(a.duration) - parseInt(b.duration)
                        } else if (sortOrder === 'Duration: High to Low') {
                            return parseInt(b.duration) - parseInt(a.duration)
                        } else {
                            return 0
                        }
                    })
                    .map((caseForDisplay, index) => (
                        <>
                            {getCaseItem(index, caseForDisplay.lastUpdate, caseForDisplay.status, caseForDisplay.duration)}
                        </>
                    ))
                }
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

function getUserRole(): string {
    // "Operator" is the default role.
    // TODO: We need to get this value from the backend.
    return 'Operator'
}

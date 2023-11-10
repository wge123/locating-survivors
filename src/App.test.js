import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

jest.mock('aws-amplify')

describe('App', () => {

    it('renders the LoginScreen when no user given', () => {

        render(<App />)

        expect(screen.getByText('Search and Rescue Cellular Forensics Service')).toBeInTheDocument()
    })

    it('routes to case list screen when user is present', () => {
        const cognitoUser = {attributes: {name: 'user'}}
        window.sessionStorage.setItem('user',JSON.stringify(cognitoUser))

        render(<App />)
        expect(screen.getByText('Sort By...')).toBeInTheDocument()
    })

})
import React, {useState} from 'react'
import { useLocation } from 'react-router-dom'

export default function ECRBuilderScreen() {
    const location = useLocation()
    const { phone_number } = location.state


    return (
        <div id='container'>
            ECR Builder Screen
            number is - {phone_number}
        </div>
    )
}
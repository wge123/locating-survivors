import React, {useContext, useEffect, useState} from 'react'
import AccessPDFContext from '../../context/accessPDFContext.tsx'
import {useNavigate} from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import {fetchPdf} from '../../utils/fetchPdf.tsx'

export default function EcrPreview() {
    const { accessAllowed } = useContext(AccessPDFContext)
    const navigate = useNavigate()

    const [pdfUrl, setPdfUrl] = useState('')
    const location = useLocation()
    const ecrData = ''
    const state = window[ecrData]
    useEffect(() => {
        console.log(state)
        fetchPdf(state)
            .then(({ pdfUrl }) => {
                console.log(pdfUrl)
                setPdfUrl(pdfUrl)
                console.log(pdfUrl)
            })
            .catch((error: Error) => console.error(error))
    }, [])
    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
            {pdfUrl && (
                <iframe
                    src={pdfUrl}
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%'
                    }}
                ></iframe>
            )}
        </div>
    )
}

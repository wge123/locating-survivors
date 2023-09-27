import React, {useContext, useEffect, useState} from 'react'
import { PDFDocument } from 'pdf-lib'
import AccessPDFContext from '../../context/accessPDFContext.tsx'
import {redirect, useNavigate} from 'react-router-dom'
import ecrPreview from '../../assets/sprintExigentCircumstancesForm.pdf'


export default function EcrPreview() {
    const { accessAllowed } = useContext(AccessPDFContext)
    const [pdfUrl, setPdfUrl] = useState('')
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (!accessAllowed) {
            navigate('/ecr_builder')
        }
    }, [accessAllowed, navigate])

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await fetch(ecrPreview)
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }

                const existingPdfBytes = await response.arrayBuffer()
                const pdfDoc = await PDFDocument.load(existingPdfBytes)
                const pdfBytes = await pdfDoc.save()
                const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })
                const pdfUrl = URL.createObjectURL(pdfBlob)

                setPdfUrl(pdfUrl)
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error)
            }
        }

        fetchPdf()
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

import ecrPreview from '../assets/sprintExigentCircumstancesForm.pdf'
import {PDFDocument, StandardFonts} from 'pdf-lib'

export const fetchPdf = async (stateHash): Promise<{ pdfUrl: string; pdfBlob: Blob }> => {
    try {
        const response = await fetch(ecrPreview)
        console.log(stateHash)
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        
        const existingPdfBytes = await response.arrayBuffer()
        const pdfDoc = await PDFDocument.load(existingPdfBytes)
        const page = pdfDoc.getPages()[0]
        const font = await pdfDoc.embedFont(StandardFonts.ZapfDingbats)
        // Law Enforcement Agency
        page.drawText('E4D: Locating Survivors', {
            x: 300,
            y: 550,
            size: 12,
        })
        // LEA addy & phone #
        // LEA addy & phone #
        // for now using ucf addy & phone number may change later
        page.drawText('4000 Central Florida Blvd, Orlando, FL', {
            x: 200,
            y: 538.5,
            size: 10,
        })
        page.drawText('407 823-2000', {
            x: 225,
            y: 526.5,
            size: 10,
        })
        // coast guard user info
        page.drawText('Coast Guard Recruit '+ stateHash.state.user.name, {
            x: 225,
            y: 515.5,
            size: 10,
        })
        page.drawText(stateHash.state.user.email, {
            x: 225,
            y: 504.5,
            size: 10,
        })
        // Supervisor information
        // leaving blank for now ( as of 9/28/23 )
        // Phone number
        page.drawText(stateHash.state.phoneNumber, {
            x: 250,
            y: 365,
            size: 12,
        })
        // Description
        page.drawText('This person is lost at sea!!', {
            x: 190,
            y: 352,
            size: 12,
        })
        // checkboxes here
        const checkedStates = stateHash.state.checkedStates
        if (checkedStates['subInfo']) {
            page.drawText('\u2713', {
                x: 135,
                y: 317,
                size: 12,
                font: font
            })
        }
        if (checkedStates['callDetail']) {
            page.drawText('\u2713', {
                x: 135,
                y: 305,
                size: 12,
                font: font
            })
        }
        if (checkedStates['historicalLocInfo']) {
            page.drawText('\u2713', {
                x: 135,
                y: 293,
                size: 12,
                font: font
            })
        }
        if (checkedStates['precisionLoc']) {
            page.drawText('\u2713', {
                x: 135,
                y: 268,
                size: 12,
                font: font
            })
        }
        // Signature
        page.drawText(stateHash.state.user.name, {
            x: 190,
            y: 150,
            size: 15,
        })
        // date
        page.drawText(stateHash.state.date, {
            x: 375,
            y: 115,
            size: 15,
        })
        return new Promise<{pdfUrl: string, pdfBlob: Blob}>( (resolve, reject) => {
            pdfDoc.save()
                .then(pdfBytes => {
                    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })
                    const pdfUrl = URL.createObjectURL(pdfBlob)
                    resolve({pdfUrl, pdfBlob})
                })
                .catch(error => {
                    reject(error)
                })
        })
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
    }
}
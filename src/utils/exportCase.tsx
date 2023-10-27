export const exportCase = (caseData) => {
    const header = Object.keys(caseData).join(',')

    const rows = []

    // Determine the maximum length among array fields
    const arrayLength = Math.max(
        ...Object.values(caseData).map(
            val => Array.isArray(val) ? val.length : 0
        )
    )

    // Create rows based on the array elements
    for (let i = 0; i < arrayLength ; i++) {
        const row = []

        for (const key in caseData) {
            if (Array.isArray(caseData[key])) {
                row.push(caseData[key][i] !== undefined ? caseData[key][i] : '')
            } else {
                row.push(i === 0 ? caseData[key] : '')
            }
        }

        rows.push(row.join(','))
    }

    // Combine header and rows into CSV content
    const csvContent = `${header}\n${rows.join('\n')}`

    // Create Blob object
    const blob = new Blob([csvContent], { type: 'text/csvcharset=utf-8' })

    // Create and configure download link
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `case_${caseData.id}.csv`)
    link.style.visibility = 'hidden'

    // Add link to DOM, trigger download, then remove link
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
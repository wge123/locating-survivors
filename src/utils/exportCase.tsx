export const exportCase = (caseData) => {
    const header = Object.keys(caseData).join(',')
    const row = Object.values(caseData).join(',')
    const caseId = caseData.id

    const csvContent = `${header}\n${row}`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `case_${caseId}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
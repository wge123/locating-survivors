const { S3 } = require('@aws-sdk/client-s3')

const s3 = new S3()

exports.handler = async (event) => {
    let body
    if (event.body) {
        try {
            body = JSON.parse(event.body)
        } catch (e) {
            console.error('JSON parsing failed:', e)
            console.error(event.body)
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid JSON' })
            }
        }
    } else {
        console.error('event.body is undefined or null')
        return {
            statusCode: 400,
            body: JSON.stringify({ message: event})
        }
    }

    const { blob, fileName } = body

    const params = {
        Bucket: 'locatingsurvivors-pdfs-prod',
        Key: fileName,
        Body: blob,
        ContentType: 'application/pdf'
    }

    try {
        await s3.putObject(params)
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Successfully uploaded' })
        }
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: e.message })
        }
    }
}

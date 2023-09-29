/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const S3 = new AWS.S3();


exports.handler = async (event) => {
    let body;
    console.info(event)
    console.info(event.body)
    if (event.body) {
        try {
            body = JSON.parse(event.body);
        } catch (e) {
            // Handle JSON parsing error
            console.error("JSON parsing failed:", e);
            console.error(event.body)
        }
    } else {
        // Handle case where event.body is undefined or null
        console.error("event.body is undefined or null");
    }
    /*
    const {blob, fileName} = body

    const params = {
        Bucket: 'locatingsurvivors-pdfs-prod',
        Key: fileName,
        Body: blob,
        ContentType: 'application/pdf'
    }
    try {
        await S3.putObject(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Successfully uploaded' })
        }
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: e.message +"hello"})
        }
    }
    */
};

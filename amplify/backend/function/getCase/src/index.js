
/* Amplify Params - DO NOT EDIT
    ENV
    REGION
    STORAGE_CASE_ARN
    STORAGE_CASE_NAME
    STORAGE_CASE_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */


const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb')
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
})
const documentClient = DynamoDBDocument.from(client)

exports.handler = async (event) => {
    //const caseId  = event.pathParameters.id
    try {

        // const caseId = event.queryStringParameters.id // uncomment if using proxy
        const id = event.queryStringParameters.id
        // uncomment if using proxy
        // const caseId = event.id // uncomment if not using proxy
        console.log('ID is ' + id)
        const params = {
            TableName: process.env.STORAGE_CASE_NAME,
            Key: {
                id: id,
            },
        }
        const data = await documentClient.get(params)
        return {
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: 200,
            body: JSON.stringify(data.Item),
        }
    } catch (error) {
        console.error('Error:', error)
        return {
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred or user doesnt exist' }),
        }
    }


}

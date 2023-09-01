
/* Amplify Params - DO NOT EDIT
    API_LSAPI_APIID
    API_LSAPI_APINAME
    AUTH_LSAUTH_USERPOOLID
    ENV
    FUNCTION_BASICFUNCTION_NAME
    REGION
    STORAGE_CASE_ARN
    STORAGE_CASE_NAME
    STORAGE_CASE_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */


const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
});
const documentClient = DynamoDBDocument.from(client);

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const transactionId = event.id
    const transactionType = event.type
    const transactionAmount = event.amount

    console.log("ID: " + transactionId)
    console.log("Type: " + transactionType)
    console.log("Amount: " + transactionAmount)


    const caseId = event.id
    console.log("ID is " + caseId)
    const params = {
        TableName: process.env.STORAGE_CASE_NAME,
        Key: {
            id: caseId
        },
    }
    try {
        const data = await documentClient.get(params)
        return {
            statusCode: 200,
            body: JSON.stringify(data.Item),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred' }),
        };
    }

};

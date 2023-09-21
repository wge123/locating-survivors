/* Amplify Params - DO NOT EDIT
    API_LSAPI_APIID
    API_LSAPI_APINAME
    AUTH_LSAUTH_USERPOOLID
    ENV
    REGION
    STORAGE_ECR_ARN
    STORAGE_ECR_NAME
    STORAGE_ECR_STREAMARN
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
    const ecr_id = event.queryStringParameters.id

    try {

        const params = {
            TableName: process.env.STORAGE_ECR_NAME,
            Key: {
                id: ecr_id,
            }
        }

        const data = await documentClient.delete(params)
        return {
            statusCode: 200,
            body: JSON.stringify('ECR deleted')
        }
    } catch (err) {
        console.error('Error deleting item:', err)
        return {
            statusCode: 500,
            body: JSON.stringify('Error deleting item')
        }
    }
}


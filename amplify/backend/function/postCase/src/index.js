
/* Amplify Params - DO NOT EDIT
    API_LSAPI_APIID
    API_LSAPI_APINAME
    AUTH_LSAUTH_USERPOOLID
    ENV
    REGION
    STORAGE_CASE_ARN
    STORAGE_CASE_NAME
    STORAGE_CASE_STREAMARN
    STORAGE_USER_ARN
    STORAGE_USER_NAME
    STORAGE_USER_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb')
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
})
// import uuid to get random id
const { v4: uuidv4 } = require('uuid')

const documentClient = DynamoDBDocument.from(client)
exports.handler = async (event) => {
    const random_id = uuidv4()
    const date = new Date()
    const createdAt = date.toISOString()
    const lastChangedAt = date.getTime()
    let body = event
    let item = {}

    Object.keys(body).forEach(key => {
        item[key] = body[key]
    })
    item.id = random_id


    try {
        // first we check if user_id was passed in body
        if (!item.user_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'user_id is required'
                })
            }
        }
        // scan a user table and return all of the ids
        const scan = await documentClient.scan({
            TableName: process.env.STORAGE_USER_NAME,
            ProjectionExpression: 'id'

        })

        console.log(scan)

        const user_ids = scan.Items.map(item => item.id)
        console.log(user_ids)
        if (user_ids.includes(item.user_id)) {
            console.log('user_id exists')
        }
        else if (!user_ids.includes(item.user_id)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'user_id does not exist'
                })
            }
        }


        item = {
            id: item.id,
            user_id: item.user_id,
            name: item.name,
            createdAt,
            updatedAt: createdAt,
            __typename: 'Case',
            _lastChangedAt: lastChangedAt,
            _version: 1,
        }




        const data = await documentClient.put({
            TableName: process.env.STORAGE_CASE_NAME,
            Item: item,

        })

        console.log(data)
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        }
    } catch (err) {
        console.log(err)
        return err
    }

}

/* Amplify Params - DO NOT EDIT
    API_LSAPI_APIID
    API_LSAPI_APINAME
    ENV
    REGION
    STORAGE_CASE_ARN
    STORAGE_CASE_NAME
    STORAGE_CASE_STREAMARN
    STORAGE_ECR_ARN
    STORAGE_ECR_NAME
    STORAGE_ECR_STREAMARN
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

    const ecr_id = uuidv4()
    const date = new Date();
    const createdAt = date.toISOString();
    const lastChangedAt = date.getTime();
    let body = event
    let item = {}

    Object.keys(body).forEach(key => {
        item[key] = body[key]
    })

    try {

        item.id = ecr_id

        // check to see if case_id was passed in body, only required paramater
        if (!item.case_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'case_id is required'
                })
            }
        }

        // lets query the case table to see if the case_id exists
        const case_query = await documentClient.query({
            TableName: process.env.STORAGE_CASE_NAME,
            KeyConditionExpression: 'id = :case_id',
            ExpressionAttributeValues: {
                ':case_id': item.case_id
            }
        })
        // check if const query is null

        if (case_query.Count === 0 || !case_query) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'case_id does not exist'
                })
            }
        }



        // retrieve user_id from case table
        const user_id = case_query.Items[0].user_id
        if (user_id) item.user_id = user_id
        else {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'user_id does not exist in case table'
                })
            }
        }

        const case_table_id = case_query.Items[0].id
        if (case_table_id) item.case_id = case_table_id
        const case_table_cell_number = case_query.Items[0].cell_number
        if (case_table_cell_number) item.cell_number = case_table_cell_number

        if (case_query.Items[0].cell_provider) item.cell_provider = case_query.Items[0].cell_provider



        // lets query user table to see if user_id exists
        const user_query = await documentClient.query({
            TableName: process.env.STORAGE_USER_NAME,
            KeyConditionExpression: 'id = :user_id',
            ExpressionAttributeValues: {
                ':user_id': user_id
            }
        })
        // check if const query is null
        if (user_query.Count === 0 || !user_query) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'user_id does not exist'
                })
            }
        }

        // get name and email from user table
        const user_name = user_query.Items[0].name
        const email = user_query.Items[0].email


        /* We will be checking to see if the expected fields are passed into the request body
            if they are not they will be assigned a default value or return an error
         */

        // this should never happen
        if (!item.id) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'ID should exist'
                })
            }
        }


        if (!item.case_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'case_id should exist'
                })
            }
        }


        //Here we are going to assign default values to the fields that are not passed in the request body


        if (!item.cell_number) item.cell_number = case_table_cell_number
        if (!item.cell_provider) item.cell_provider = "Sprint"
        if (!item.name) item.name = user_name
        if (!item.email) item.email = email
        if (!item.date) item.date = new Date().toISOString() // need to add date
        if (!item.subscriber_info) item.subscriber_info = false
        if (!item.periodic_location) item.periodic_location = false
        if (!item.last_known_information) item.last_known_information = false
        if (!item.duration) item.duration = 0
        if (!item.call_detail) item.call_detail = false
        if (!item.sms_detail) item.sms_detail = false

        // End of expected fields



        // now we put the item in the table!

        const put_item = await documentClient.put({
            TableName: process.env.STORAGE_ECR_NAME,
            Item: item

        })


        return {
            statusCode: 200,
            body: JSON.stringify("ECR created", put_item)
        }

    } catch (error) {
        console.log(error)
        return error
    }


};

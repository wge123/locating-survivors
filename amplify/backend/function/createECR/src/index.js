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
		// lets make sure that the case_id is passed in the body
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
		item = {
			id : ecr_id,
			case_id : case_query.Items[0].id,
			cell_number : case_query.Items[0].cell_number,
		}
		if (item.id == null) return {
			statusCode: 400,
			body: JSON.stringify({
				message: 'id is required'
			})
		}
		if (item.case_id == null) return {
			statusCode: 400,
			body: JSON.stringify({
				message: 'case_id is required'
			})
		} 


		
		
		
		return {
            statusCode: 200,
            body: JSON.stringify("SUCCESS",case_query.id),
        }
		


	} catch (error) {
		console.log(error)
        return error
	}

	// we will pass in the case number, as the request body
    // when creating a new case we will get the anaylst name from the user table

	// we will get the case number from the case table
	// we will get the email from the case table


	// we will then crea
};


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

const documentClient = DynamoDBDocument.from(client)
exports.handler = async (event) => {

	let body = event
	let item = {}
	Object.keys(body).forEach(key => {
		item[key] = body[key];
	});
	try {
		const data = await documentClient.put({
			TableName: process.env.STORAGE_CASE_NAME,
			Item: item
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


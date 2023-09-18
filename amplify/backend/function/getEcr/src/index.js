/* Amplify Params - DO NOT EDIT
	API_LSAPI_APIID
	API_LSAPI_APINAME
	AUTH_LSAUTH_USERPOOLID
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
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
    API_LSAPI_APIID
    API_LSAPI_APINAME
    AUTH_LSAUTH_USERPOOLID
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
exports.handler = async (event) => {
    // lets make an empty try catch
    // lets get id from queryString
    const ecr_id = event.queryStringParameters.id

    try {
        // get item from dynamoDBTable ECR
        const params = {
            TableName: process.env.STORAGE_ECR_NAME,
            Key: {
                id: ecr_id,
            }
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
        console.log(error)
    }

}
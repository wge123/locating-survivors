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
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: JSON.stringify('Hello from Lambda!'),
    };
};

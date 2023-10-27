

const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY; // Make sure to set this environment variable in your AWS Lambda function configuration

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            token: MAPBOX_API_KEY
        }),
    };
};

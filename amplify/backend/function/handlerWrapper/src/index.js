/* Amplify Params - DO NOT EDIT
    API_LSAPI_APIID
    API_LSAPI_APINAME
    AUTH_LSAUTH_USERPOOLID
    ENV
    FUNCTION_HANDLER_NAME
    REGION
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
    ENV
    FUNCTION_HANDLER_NAME
    REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

// Imports
const { CloudWatchEventsClient, PutRuleCommand, EnableRuleCommand } = require('@aws-sdk/client-cloudwatch-events')
const { LambdaClient, InvokeCommand, GetFunctionCommand } = require('@aws-sdk/client-lambda')
const { STSClient, GetCallerIdentityCommand } = require('@aws-sdk/client-sts')
// Clients
const cloudwatchClient = new CloudWatchEventsClient({ region: process.env.AWS_REGION })
const lambda = new LambdaClient({ region: process.env.AWS_REGION })
const stsClient = new STSClient({ region: process.env.AWS_REGION })



// HEADERS
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': '*'
}

const timeout = (ms, promise) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Timeout'))
        }, ms)
        promise.then(resolve, reject)
    })
}
const getCallerIdentity = async () => {
    try {
        const data = await stsClient.send(new GetCallerIdentityCommand({}))
        console.log('AWS Account ID:', data.Account)
        return data.Account
    } catch (error) {
        console.error('Error retrieving AWS account ID:', error)
    }
}


exports.handler = async (event) => {
    // essential fields from events
    const case_id = event.case_id
    const phone_number = event.phone_number
    const interval = event.interval
    const duration = event.duration
    let name
    if (!event.name) {
        name = 'DEFAULT'
    } else {
        name = event.name
    }
    // payload for handler
    const handlerPayload = {
        case_id: case_id,
        phone_number: phone_number,
        name: name
    }
    // parameters to invoke handler
    const handlerParams = {
        FunctionName: process.env.FUNCTION_HANDLER_ARN,
        Payload: JSON.stringify(handlerPayload)
    }
    let rate, period

    if (interval == true) {
        rate = 'rate(15 min)'
    }
    getCallerIdentity()
    const baseName = 'InvokeHandler'
    const ruleName = `${baseName}-${case_id}`
    const functionName = process.env.FUNCTION_HANDLER_NAME
    const accountId = await getCallerIdentity()
    const region = process.env.AWS_REGION
    const configuredFunction = `arn:aws:lambda:${region}:${accountId}:function:${functionName}`
    console.log('configured function ', configuredFunction)
    const setit = 'arn:aws:lambda:us-east-1:862094412808:function:handler-prod'
    const cloudWatchParams = {
        Name: ruleName,
        ScheduleExpression: 'rate(2 min)',
        ExpirationDate: new Date(Date.now() + (7 * 60 * 1000)),
        Targets: [{
            Input: handlerParams.Payload,
            Arn: configuredFunction
        }]
    }
    const ruleCommand = new PutRuleCommand(cloudWatchParams)

    // invocation for handler
    const handlerCommand = new InvokeCommand(handlerParams)
    try {
        // await timeout(9000,
        //     Promise.all([
        //         lambda.send(handlerCommand),
        //     ])
        // )
        await cloudwatchClient.send(ruleCommand)
        //const enableCommand = new EnableRuleCommand({ Name: cloudWatchParams.Name })
        //await cloudwatchClient.send(enableCommand)
        return apiResponse(200, { message: 'SUCCESS' })
    } catch (error) {
        console.error(error)
        return apiResponse(400, { message: error.message })


    }

}


function apiResponse(statusCode, body) {
    return {
        statusCode,
        headers: CORS_HEADERS,
        body: JSON.stringify(body)
    }
}

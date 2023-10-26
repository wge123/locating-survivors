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
const {
    CloudWatchEventsClient,
    PutRuleCommand,
    EnableRuleCommand,
    PutTargetsCommand,
    PutEventsCommand
} = require('@aws-sdk/client-cloudwatch-events')

const {
    LambdaClient,
    AddPermissionCommand
} = require('@aws-sdk/client-lambda')

const {
    STSClient,
    GetCallerIdentityCommand
} = require('@aws-sdk/client-sts')

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

// Helper functions
const getCallerIdentity = async () => {
    try {
        const data = await stsClient.send(new GetCallerIdentityCommand({}))
        return data.Account
    } catch (error) {
        console.error('Error retrieving AWS account ID:', error)
    }
}

// Main handler
exports.handler = async (event) => {

    // essential fields from events
    const case_id = event.case_id
    const phone_number = event.phone_number
    const interval = event.interval
    const duration = event.duration


    const baseName = 'InvokeHandler'
    const ruleName = `${baseName}-${case_id}`
    const functionName = process.env.FUNCTION_HANDLER_NAME
    const accountId = await getCallerIdentity()
    const region = process.env.AWS_REGION
    const configuredFunction = `arn:aws:lambda:${region}:${accountId}:function:${functionName}`

    let name
    if (!event.name) {
        name = 'DEFAULT'
    } else {
        name = event.name
    }

    let rate = 'rate(3 minutes)'

    if (interval == 'true') {
        rate = 'rate(15 minutes)'
    }

    try {

        const handlerPayload = {
            case_id: case_id,
            phone_number: phone_number,
            name: name
        }
        const timeFrame = Math.floor(Date.now() / 1000) + (10 * 60) // ten minutes
        console.log(timeFrame) // this is utc time


        // const putRuleParams = {
        //     Name: ruleName,
        //     ScheduleExpression: 'rate(3 minutes)',
        //     Timestamp: timeFrame,
        //     State: 'ENABLED',
        //     EventBusName: 'default'
        // }
        const expiration = new Date(Date.now() + (1 * 5 * 60 * 1000)).toISOString() // hours*mins*seconds*milliseconds
        const putRuleParams = {
            Name: ruleName,
            ScheduleExpression: rate, //'cron(0/5 * * * ? *)' or 'rate(2 minutes)'
            ExpirationDate: expiration,
            State: 'ENABLED',
            EventBusName: 'default'
        }

        const targetParams = {
            Rule: ruleName,
            Targets: [{
                Id: ruleName,
                Arn: configuredFunction,
                Input: JSON.stringify(handlerPayload),
            }]
        }

        const enableParams = {
            Name: ruleName
        }

        const putEventsParams = {
            Entries: [
                {
                    Resources: [configuredFunction],
                    DetailType: 'AppEvent',
                    Detail: JSON.stringify(handlerPayload),
                    EventBusName: 'default',
                }
            ]
        }

        const ruleCommand = new PutRuleCommand(putRuleParams)
        const enableCommand = new EnableRuleCommand(enableParams)
        const targetCommand = new PutTargetsCommand(targetParams)
        const putEventsCommand = new PutEventsCommand(putEventsParams)

        const rule = await cloudwatchClient.send(ruleCommand)
        const eventARN = rule.RuleArn

        // const StatementId
        const statementId = 'EventBridgeTrigger' + case_id
        const Params = {
            FunctionName: process.env.FUNCTION_HANDLER_NAME,
            StatementId: statementId,
            Action: 'lambda:InvokeFunction',
            Principal: 'events.amazonaws.com',
            SourceArn: eventARN,
        }

        const permissionCommand = new AddPermissionCommand(Params)
        await lambda.send(permissionCommand)
        await cloudwatchClient.send(targetCommand)

        await cloudwatchClient.send(putEventsCommand)
        await cloudwatchClient.send(enableCommand)

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
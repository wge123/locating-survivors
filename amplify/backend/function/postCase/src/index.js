
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

// DynmoDB SDK
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb')
const dBClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
})
const documentClient = DynamoDBDocument.from(dBClient)



// Cognito SDK
const { CognitoIdentityProviderClient, ListUsersCommand } = require("@aws-sdk/client-cognito-identity-provider");
const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION
});
const UserPoolId = process.env.AUTH_LSAUTH_USERPOOLID;


// import uuid to get random id
const { v4: uuidv4 } = require('uuid')

//import CORS
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': '*'
}

const TABLE_NAME = process.env.STORAGE_CASE_NAME



exports.handler = async (event) => {
    // event must include user_id and phone_number
    try {
        let item = getItemFromBody(event)



        if (!item.user_id) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    message: "Missing user_id"
                })
            }
        }
        if (!item.phone_number) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    message: "Missing phone_number"
                })
            }
        }
        const userId = item.user_id;
        const phone_number = item.phone_number;
        const case_id = uuidv4();



        const user = await getUser(userId)
        const email = user.Attributes.find(attr => attr.Name === 'email').Value
        const name = user.Attributes.find(attr => attr.Name === 'name').Value
        item = moldItem(item, case_id, userId, phone_number, email, name)
        console.log("item", item)

        // insert item into case table





        // const email = user.Attributes.find(attr => attr.Name === 'email').Value
        console.log("email", email)
        // const name = user.Attributes.find(attr => attr.Name === 'name').Value
        console.log("name", name)



        await insertItem(item)

        return apiResponse(200, { message: "success" })





    } catch (error) {

        return apiResponse(400, { message: error.message });
    }



}
// get user object from cognito using userId which is the cognito sub
async function getUser(userId) {
    const params = {
        UserPoolId: UserPoolId,
        Filter: `sub = "${userId}"`,
    };

    const command = new ListUsersCommand(params);

    const response = await client.send(command);
    // const ret = response.Users[0];
    // const email = ret.Attributes.find(attr => attr.Name === 'email').Value

    // const name = ret.Attributes.find(attr => attr.Name === 'name').Value

    return response.Users[0];



}
function getItemFromBody(body) {
    let item = {}
    Object.keys(body).forEach(key => {
        item[key] = body[key]
    })
    return item

}

function moldItem(item, case_id, userId, phone_number, email, name) {
    item = {
        id: case_id,
        user_id: userId,
        phone_number: phone_number,
        email: email,
        name: name,
        date: new Date().toISOString(),
        time_posted: new Date().toISOString(),
        duration: 0,
        time_updated: new Date().toISOString(),
        // add a field to item that takes the time of the last update and adds it 
        next_update: new Date().toISOString(),
        longitude: [],
        latitude: [],
        uncertainty: [],
        status: ''
    }
    return item


}
// lets make a function that will place item in the case table 

async function insertItem(item) {
    const params = {
        TableName: TABLE_NAME,
        Item: item
    }
    await documentClient.put(params)

}
function apiResponse(statusCode, body) {
    return {
        statusCode,
        headers: CORS_HEADERS,
        body: JSON.stringify(body)
    };


}


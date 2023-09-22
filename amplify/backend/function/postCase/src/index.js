
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




exports.handler = async (event) => {
    const userId = event.user_id;
    // const phone_number = event.phone_number;

    const print_this = await getUser(userId)


    const email = print_this.Attributes.find(attr => attr.Name === 'email').Value
    console.log("email", email)
    const name = print_this.Attributes.find(attr => attr.Name === 'name').Value
    console.log("name", name)


    console.log("print_this", print_this)
    const username = print_this.Username
    console.log("username", username)




}
// get user object from cognito using userId which is the cognito sub
async function getUser(userId) {
    const params = {
        UserPoolId: UserPoolId,
        Filter: `sub = "${userId}"`,
    };

    const command = new ListUsersCommand(params);

    const response = await client.send(command);

    return response.Users[0];



}

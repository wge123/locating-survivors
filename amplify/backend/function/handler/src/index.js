/* Amplify Params - DO NOT EDIT
    ENV
    FUNCTION_EMAILLISTENER_NAME
    FUNCTION_EMAILSCRAPER_NAME
    FUNCTION_EMAILSENDER_NAME
    REGION
Amplify Params - DO NOT EDIT */


const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda")

const lambda = new LambdaClient({ region: process.env.AWS_REGION });





/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    let case_id = event["case_id"];
    console.log(case_id);

    let name = event.name;
    console.log(name);
    let phone_number = event.phone_number;
    console.log(phone_number);

    const senderPayload = {
        case_id: case_id,
        name: name,
        phone_number: phone_number
    };

    const listenerPayload = {
        case_id: case_id

    };



    const sender = {
        FunctionName: "emailSender-will",
        Payload: JSON.stringify(senderPayload),
    };


    const listener = {
        FunctionName: "emailListener-will",
        Payload: JSON.stringify(listenerPayload),
    };





    const command_two = new InvokeCommand(sender);
    const command = new InvokeCommand(listener);


    try {
        const data_send = await lambda.send(command_two);
        console.log(data_send);

        const data = await lambda.send(command);
        console.log(data);
    } catch (err) {
        console.error(err);
    }

}


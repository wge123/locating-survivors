/* Amplify Params - DO NOT EDIT
    ENV
    REGION
    STORAGE_CASE_ARN
    STORAGE_CASE_NAME
    STORAGE_CASE_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb')
const dBClient = new DynamoDBClient({
    region: process.env.AWS_REGION
})
const documentClient = DynamoDBDocument.from(dBClient)

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': '*'
}

exports.handler = async (event) => {



    let item = getItemFromBody(event)
    console.log(item)
    const id = item.ID
    // console.log("id", id)
    const latitude = item.Latitude
    // console.log("latitude", latitude)
    const longitude = item.Longitude
    // console.log("longitude", longitude)
    const uncertainty = item.Uncertainty
    // console.log("uncertainty", uncertainty)
    const time = item.Time



    const updateParams = {
        TableName: process.env.STORAGE_CASE_NAME,
        Key: {
            id: id
        },
        UpdateExpression: 'SET #latitudes = list_append(if_not_exists(#latitudes, :empty_list), :latitude), #longitudes = list_append(if_not_exists(#longitudes, :empty_list), :longitude), #uncertainties = list_append(if_not_exists(#uncertainties, :empty_list), :uncertainty), #times = list_append(if_not_exists(#times, :empty_list), :time)',
        ExpressionAttributeNames: {
            '#latitudes': 'latitude',
            '#longitudes': 'longitude',
            '#uncertainties': 'uncertainty',
            '#times': 'time'
        },
        ExpressionAttributeValues: {
            ':latitude': [latitude],
            ':longitude': [longitude],
            ':uncertainty': [uncertainty],
            ':time': [time],
            ':empty_list': []
        }

    }


    try {

        await documentClient.update(updateParams)
        return apiResponse(200, 'Success')


    } catch (error) {
        return apiResponse(400, { message: error.message })

    }
}

function getItemFromBody(body) {

    let item = {}

    Object.keys(body).forEach(key => {
        item[key] = body[key]
    })

    return item

}

function apiResponse(statusCode, body) {
    return {
        statusCode,
        headers: CORS_HEADERS,
        body: JSON.stringify(body)
    }
}

import json
import boto3

lambda_client = boto3.client('lambda')


def handler(event, context):
  case_id = event['id']
  lambda_payload = {"id":case_id}

  lambda_client.invoke(FunctionName='emailListener', 
                     InvocationType='RequestResponse',
                     Payload=json.dumps(lambda_payload))
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps('Success')
  }
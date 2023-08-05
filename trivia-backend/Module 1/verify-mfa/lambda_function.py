import json
import helper
from helper import get_secret

response = get_secret()

mfaTableName = json.loads(response['SecretString'])['mfaTableName']

headers = {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET'
        }

def lambda_handler(event, context):

    try:
        data = json.loads(event['body'])
    except:
        return {
        'statusCode': 404,
        'body': json.dumps({"message":"Body not found", "data":""})
        }
    
    resp = helper.verifyQuestions(mfaTableName, data)
    if resp:
        return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({"message":"Verified", "data":""})
        }
    else:
        return {
        'statusCode': 401,
        'headers': headers,
        'body': json.dumps({"message":"Unverified", "data":""})
        }

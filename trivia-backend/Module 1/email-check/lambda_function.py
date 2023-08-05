import json
import helper
from helper import get_secret

response = get_secret()
print("response ", response)

mfaTableName = json.loads(response['SecretString'])['mfaTableName']

headers = {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        }

def lambda_handler(event, context):
    print("event ", event)
    email = event['queryStringParameters'].get('email')
    resp = helper.emailExists(mfaTableName, email)
    if resp:
        return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({"message":"Email Exists", "data":""})
        }
    else:
        return {
        'statusCode': 404,
        'headers': headers,
        'body': json.dumps({"message":"Email not found", "data":""})
        }
    

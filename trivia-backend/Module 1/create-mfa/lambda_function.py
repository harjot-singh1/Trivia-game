import json
import helper
from helper import get_secret

response = get_secret()
print("response ", response)

mfaTableName = json.loads(response['SecretString'])['mfaTableName']

headers = {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        }

print("mfaTableName ", mfaTableName)

def lambda_handler(event, context):
    try:
        questions = json.loads(event['body'])
    except Exception as e:
        return {
        'statusCode': 404,
        'body': json.dumps({'message': str(e), 'data':''})
        }
    resp = helper.createTable(mfaTableName)
    if resp:
        print("Table created")
        
    resp = helper.addItems(mfaTableName, questions)
    
    print("response ", resp)
    if resp:
        return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'message':'Data inserted sucessfully', 'data':''})
        }
    else:
        return {
        'statusCode': 400,
        'headers': headers,
        'body': json.dumps({'message':'Data insertion fail', 'data':''})
        }


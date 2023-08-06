import json
import helper

headers = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 
    'Access-Control-Allow-Headers': '*', 
  };

def lambda_handler(event, context):
    
    tableName = "user-data"
    query_params = event['queryStringParameters']
    email = query_params.get('email')
    profile = helper.getItem(tableName, email)
    if profile:
        return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(profile)
        }
    return {
        'statusCode': 404,
        'headers': headers,
        'body': json.dumps('User not found')
        }


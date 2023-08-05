import json
import helper

headers = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 
    'Access-Control-Allow-Headers': '*', 
  };

def lambda_handler(event, context):
    tableName = "user-data"
    # query_params = event['queryStringParameters']
    # email = query_params.get('email')
    data = helper.getItems(tableName)

    if data:
        return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(data)
        }
    return {
        'statusCode': 404,
        'headers': headers,
        'body': json.dumps('Some error occured')
        }

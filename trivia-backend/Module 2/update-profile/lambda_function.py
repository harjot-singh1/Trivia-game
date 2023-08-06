import json
import helper


def lambda_handler(event, context):
    data = json.loads(event['body'])
    query_params = event['queryStringParameters']
    email = query_params.get('email')
    tableName = "user-data"
    response = helper.update_user(tableName, email, data)
    
    return {
        'statusCode': 200,
        'body': json.dumps({'message':'User data updated', 'data': ''})
    }

import json
import helper

headers = {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
        }


def lambda_handler(event, context):
    data = json.loads(event['body'])
    print("data ", data)
    # Modify the data as needed
    data["points"] = "0"
    data["win"] = "0"
    data["totalPlayed"] = "0"
    data["loss"] = "0"
    
    try:
        email = data['email']
    except KeyError:
        return {
        'statusCode': 400,
        'headers': headers,
        'body': json.dumps({'message':'Email is required', 'data':''})
        }

    
    tableName = "user-data"
    helper.createTable(tableName)
    resp = helper.addItems(tableName, data)
    if resp:
        return {
        'statusCode': 200,
        'headers':headers,
        'body': json.dumps({'message':'Data inserted sucessfully', 'data':''})
        }

    else:
        return {
        'statusCode': 404,
        'headers': headers,
        'body': json.dumps({'message':'Data insertion fail', 'data':''})
        }


import json
import boto3

def lambda_handler(event, context):
    try:
        print("event", event)
        text = json.loads(event['body'])['message']
        print("text ", text)
        client = boto3.client('lexv2-runtime')
        response = client.recognize_text(
            botId='G53WTIFF9F',
            botAliasId='TSTALIASID',
            localeId='en_US',
            sessionId='Harjot',
            text=text,
        )
        return {
            'statusCode': 200,
            'headers': {  # Fixed the headers section
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Credentials': True,
            },
            'body': json.dumps(response)
        }
    except Exception as e:
        return {
            'statusCode': 400,
            'body': json.dumps(str(e))
        }

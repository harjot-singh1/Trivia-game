import json
import boto3
import firebase_admin
from firebase_admin import credentials, auth
from secrets import get_secret

response = get_secret()

key = json.loads(json.loads(response['SecretString'])['google-auth'])

headers = {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET'
        }

cred = credentials.Certificate(key)

# Initialize the Firebase Admin SDK
firebase_admin.initialize_app(cred)

def lambda_handler(event, context):
    try:
        header = event['headers']
        idToken = header['idToken']
        # Initialize Firebase Admin SDK
        decoded_token = auth.verify_id_token(idToken)

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({"message": "Verified", "data":""})
        }
    except ValueError as err:
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({"message": "Unverified", "data":""})
        }
    except Exception as e:
        return {
        'statusCode': 401,
        'headers': headers,
        'body': json.dumps({'message':str(e), 'data':''})
        }
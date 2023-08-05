import json
import boto3
import firebase_admin
import traceback
from firebase_admin import credentials, auth
from secrets import get_secret

response = get_secret()

key = json.loads(json.loads(response['SecretString'])['google-auth'])


cred = credentials.Certificate(key)

# Initialize the Firebase Admin SDK
firebase_admin.initialize_app(cred)

headers = {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET'
        }

def lambda_handler(event, context):
    try:
        print("event", event)
        header = event['headers']
        idToken = header['idtoken']
        print("idtoken", idToken)
        
        # Initialize Firebase Admin SDK
        revoked = auth.verify_id_token(idToken)
        print("revoked ", revoked['uid'])
        #auth.revoke_refresh_tokens(revoked['uid'])
        
        print("after revoke token")
        
        return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'message': 'Revoked', 'data':''})
        }
    except auth.RevokedIdTokenError:
        # The token has been revoked
        
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'message': 'Revoked Id Token Error', 'data':''})
        }
    except auth.UserNotFoundError:
        print("user not found")
        # User not found
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'message': 'User not found ', 'data':''})
        }
    except ValueError as err:
        print(err)
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({'message': 'UnAuthorized', 'data':''})
        }
    except Exception as e:
        print(traceback.format_exc())
        print("Exception caught ", str(e)) 
        return{
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'message': str(e), 'data':''})
        }
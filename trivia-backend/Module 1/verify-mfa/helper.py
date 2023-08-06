import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from collections import defaultdict

dynamodb = boto3.resource('dynamodb')

def verifyQuestions(tableName, data):
    try:
        table = dynamodb.Table(tableName) 
        keysList = list(data.keys())
        keyObj = {'email':data['email']}
        # Retrieve the item from DynamoDB
        response = table.get_item(
            Key=keyObj
        )
        for key in keysList:
            if data[key] != response['Item'][key]:
                return False
        return response["Item"]
    except ClientError as err:
        print(err)
        return False
        
def get_secret():

    secret_name = "dev/trivia/google-auth"
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
        print("get_secret_value_response ", type(get_secret_value_response))
        return get_secret_value_response
    except ClientError as e:
        return "Error"
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key


dynamodb = boto3.resource('dynamodb')

def getItem(tableName, email):
    try:
        print("email ", email)
        table = dynamodb.Table(tableName) 
        keyObj = {'email':str(email)}
        # Retrieve the item from DynamoDB
        response = table.get_item(
            Key=keyObj
        )
        print("response",response)
        
        return response.get('Item', None)
    
    except ClientError as err:
        print(err)
        return None
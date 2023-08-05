import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from collections import defaultdict

dynamodb = boto3.resource('dynamodb')

def createTable(tableName):
    try:
        existing_tables = dynamodb.tables.all()
        if tableName not in existing_tables:
            table = dynamodb.create_table(
                TableName= tableName,
                KeySchema=[ 
                    {
                        'AttributeName': 'email',
                        'KeyType': 'HASH'
                    }
                ],
                AttributeDefinitions=[
                    {
                        'AttributeName': 'email',
                        'AttributeType': 'S'
                    }
                ],
                ProvisionedThroughput={
                    'ReadCapacityUnits': 10,
                    'WriteCapacityUnits': 10
                }
            )
            table.wait_until_exists()
            return table.table_status
        return "crea"
    except Exception as e:
        print(e)
        return None
        
def addItems(tableName, items):
    try:
        table = dynamodb.Table(tableName) 
        table.put_item(
            Item=items)
        return True
    except ClientError as err:
        print("err ",err)
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
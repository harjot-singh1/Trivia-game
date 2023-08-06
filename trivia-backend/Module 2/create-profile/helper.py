import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from collections import defaultdict

dynamodb = boto3.resource('dynamodb')

def createTable(tableName):
    try:

        existing_tables = dynamodb.tables.all()
        print("existing_tables", existing_tables)
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
    except Exception as e:
        print("create table error",e)
        # do something here as you require
        pass

def addItems(tableName, items):
    try:
        table = dynamodb.Table(tableName) 
        table.put_item(
            Item=items)
        return True
    except ClientError as err:
        print("err ",err)
        return False
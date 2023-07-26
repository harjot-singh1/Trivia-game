#Refernce
# https://docs.aws.amazon.com/code-library/latest/ug/python_3_dynamodb_code_examples.html

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
        print(response)
        return response["Item"]
    except ClientError as err:
        print(err)
        return ""
    
def emailExists(tableName, email):
    try:
        print("email ", email)
        table = dynamodb.Table(tableName) 
        keyObj = {'email':str(email)}
        # Retrieve the item from DynamoDB
        response = table.get_item(
            Key=keyObj
        )
        print("response",response)
        if response.get('Item'):
                return True
        return False
    except ClientError as err:
        print(err)
        return ""

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
    

def update_user(tableName, email, update_info):
    # update_info should be a dictionary with keys to be updated
    table = dynamodb.Table(tableName)
    expression_attribute_values = {f':{key}': value for key, value in update_info.items()}
    update_expression = 'SET ' + ', '.join([f'#{key} = :{key}' for key in update_info.keys()])
    expression_attribute_names={f'#{key}': key for key in update_info.keys()}
    print(expression_attribute_names)
    response = table.update_item(
        Key={'email': email},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_attribute_values,
        ExpressionAttributeNames=expression_attribute_names
    )
    return response
    
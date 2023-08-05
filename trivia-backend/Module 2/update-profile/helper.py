import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from collections import defaultdict

dynamodb = boto3.resource('dynamodb')

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
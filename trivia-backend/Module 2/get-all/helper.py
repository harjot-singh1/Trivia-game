import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key


dynamodb = boto3.resource('dynamodb')


def getItems(tableName):
    try:
        table = dynamodb.Table(tableName) 
        response = table.scan()

        # Get all items and sort the data based on the "win" attribute
        all_items = response['Items']
        sorted_data = sorted(all_items, key=lambda x: x['win'])
        sorted_data.reverse()
        return sorted_data
    
    except ClientError as err:
        print(err)
        return None
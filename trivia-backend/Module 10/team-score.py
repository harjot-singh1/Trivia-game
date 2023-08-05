import json
import requests

def lambda_handler(event, context):
    
    print("event", event)
    intent = event['sessionState']['intent']['name']
    slots = event['sessionState']['intent']['slots']
    try:
        team_name = event['sessionState']['intent']['slots']['teamID']['value']['originalValue']
    except:
        team_name = event['inputTranscript']
    payload = {

    "teamName": team_name

    }
    print("payload ", payload)
    response = requests.post('https://us-central1-serverless-391112.cloudfunctions.net/get-team-score', json = payload)  
    
    scores = response.json()['teamScore']
    print('scores', scores)
    # if scores != 'None':
    response = {
        'sessionState': {
            'dialogAction': {
                'type': 'Close',  # Use 'Close' if the conversation is finished
            },
            'intent': {
                'name': intent,
                'slots': slots,
                'state': 'Fulfilled'
            },
        },
        'messages':[
            {
                'contentType':'PlainText',
                'content': f'Your team score is {scores}  \n Thanks'
            }
        ]
    }
    # else:
    #     response = {
    #         'sessionState': {
    #             'dialogAction': {
    #                 'slotToElicit': 'teamID',
    #                 'type': 'ElicitSlot' #'Close',  # Use 'Close' if the conversation is finished
    #             },
    #             'intent': {
    #                 'name': intent,
    #                 'slots': slots
    #                  #'Fulfilled'
    #             },
    #             'state': 'Failed'
    #         },
    #         'messages':[
    #             {
    #                 'contentType':'PlainText',
    #                 'content': 'Your team is not found in DB. Please provide correct team Name'
    #             }
    #         ]
    #     }

    #Return the response
    return response
    
    # return {
    #         'statusCode': 200,
    #         'body': json.dumps("Hello")
    #     }







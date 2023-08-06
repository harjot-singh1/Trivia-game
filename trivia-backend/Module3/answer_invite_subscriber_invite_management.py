import base64
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


def answer_invitation(event, context):
  if not firebase_admin._apps:
    # Initialize the Firebase Admin SDK
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)
  
  db = firestore.client()

  pubsub_message = base64.b64decode(event['data']).decode('utf-8')
  message_dict = json.loads(pubsub_message)
  docId = message_dict['docId']
  new_status = message_dict['status']

  try:
    doc_ref = db.collection('team-invitations').document(docId)
    doc_ref.update({"status":new_status})
    teamId = doc_ref.get().get('toTeam')
    recipient = doc_ref.get().get('recipient')

    team_doc = db.collection("team-details").where("team_id", "==", str(teamId)).limit(1).get()

    for team_document in team_doc:
      
      invites = team_document.get('requested_members')
      invites.remove(recipient)
      
      if(new_status==1):
        members = team_document.get('team_members')
        members.append(recipient)
        team_document.reference.update({'requested_members':invites, 'team_members':members})
      else:
        team_document.reference.update({'requested_members':invites})

    return {"message": "Invitation processed!", "toTeam": toTeam, "recipient":recipient}

  except Exception as e:
    return {"error": str(e)}


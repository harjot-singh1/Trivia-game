import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import functions_framework

@functions_framework.http
def manage(request):

  # Set CORS headers for the preflight request
  if request.method == "OPTIONS":
    # Allows GET requests from any origin with the Content-Type
    # header and caches preflight response for an 3600s
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "3600",
    }

    return ("", 204, headers)

  # Set CORS headers for the main request
  headers = {"Access-Control-Allow-Origin": "*"}

  if not firebase_admin._apps:
    # Initialize the Firebase Admin SDK
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)
  
  db = firestore.client()

  request_json = request.get_json()
  recipient = request_json['recipient']

  invite_details = []

  try:
    query = db.collection("team-invitations").where("recipient", "==", recipient).where("status", "==", 0).get()

    for doc in query:
      sender = doc.get('sender')
      teamId = doc.get('toTeam')
      teamName = doc.get('teamName')
      invite_details_json = {"sender": sender, "team": teamId, "docId": doc.id, "teamName":teamName}
      invite_details.append(invite_details_json)

    return {"message": invite_details}, 200, headers

  except Exception as e:
    return {"error": str(e)}


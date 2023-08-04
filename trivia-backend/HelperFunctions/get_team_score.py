import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import functions_framework

@functions_framework.http
def get_score(request):

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
  teamName = request_json['teamName']

  teamScore = "None"
  team_id = "0"

  try:
    doc_ref = db.collection('team-details').where('team_name', '==', teamName).limit(1).get()

    for doc in doc_ref:
      teamId = doc.get('team_id')
      team_id = doc.get('team_id')
    
    doc_ref = db.collection('team-statistics').where('team_id', '==', team_id).limit(1).get()

    for doc in doc_ref:
      teamScore = doc.get('points_earned')
      return {"teamScore":teamScore},200,headers

    return {"teamScore":teamScore},200,headers
  except Exception as e:
    return {"error": str(e)}

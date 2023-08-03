import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import functions_framework

@functions_framework.http
def fetch_team_admin(request):

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
  adminId = request_json["adminId"]
  teamId = request_json["teamId"]
  message = ""
  response_status = 500
  team_members = []
  docId = 0

  try:
    doc_ref = db.collection('team-details').where('team_admin', '==', adminId).where('team_id', '==', teamId).limit(1).get()

    if len(doc_ref)==0:
      message = "No team where admin is " + adminId
      response_status = 404
    else:
      for doc in doc_ref:
        team_members = doc.get('team_members')
        team_members.remove(adminId)
        message = team_members
        response_status = 200
        docId = doc.id

    return ({"members":message, "docId": docId},response_status,headers)

  except Exception as e:
    return {"error": str(e)}
        






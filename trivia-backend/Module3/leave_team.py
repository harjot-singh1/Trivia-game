import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import functions_framework

@functions_framework.http
def leave_team(request):
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
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)
  
  db = firestore.client()

  request_json = request.get_json()
  leaveId = request_json['user_id']
  teamId = request_json['team_id']

  try:
    query = db.collection('team-details').where("team_id", "==", teamId).get()

    for doc in query:
      members = doc.get('team_members')
      members.remove(leaveId)

      doc.reference.update({'team_members':members})
  
  except Exception as e:
    return {"error": str(e)}, 500, headers
 
  return {"message": "Team left!"}, 200, headers

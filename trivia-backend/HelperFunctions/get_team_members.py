import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import functions_framework

@functions_framework.http
def get_members(request):
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
  teamID = request_json['teamId']

  team_details = []
  try:
    query = db.collection("team-details").where("team_id", "==", teamID).stream()

    for doc in query:
      team_members = doc.get('team_members')
      team_name = doc.get('team_name')
      team_admin = doc.get('team_admin')
      detail = {'team_members':team_members, 'team_admin':team_admin, 'team_name':team_name, 'team_id':teamID}

      team_details.append(detail)
    
    return {"message": team_details}, 200, headers
  except Exception as e:
    return {"error": str(e)}


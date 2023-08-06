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

  team_details = []

  try:
    query = db.collection("team-details").where("team_members", "array_contains", recipient).stream()

    for doc in query:
      teamName = doc.get('team_name')
      teamId = doc.get("team_id")
      team_details_json = {"team_name": teamName, "docId": doc.id, "team_id": teamId}
      team_details.append(team_details_json)

    return {"message": team_details}, 200, headers

  except Exception as e:
    return {"error": str(e)}


import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import functions_framework

@functions_framework.http
def promote_admin(request):

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
  new_admin = request_json['newAdminId']
  docId = request_json['docId']

  try:
    doc_ref = db.collection('team-details').document(docId)
    doc_ref.update({"team_admin":new_admin})

    return {"message": "Admin promoted!"},200,headers

  except Exception as e:
    return {"error": str(e)}

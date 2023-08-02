import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import functions_framework

@functions_framework.http
def insert_team_stats(request):
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

  request_json = request.get_json()
  team_id = request_json['team_id']
  stats_month = request_json['stats_month']

  if not firebase_admin._apps:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)
  
  db = firestore.client()

  win_loss = 0
  games_played = 0
  points_earned = 0

  try:
    query = db.collection("team-statistics").where("team_id", "==", team_id).where("stats_month", "==", stats_month).get()

    for doc in query:
      win_loss = doc.get("win_loss_ratio")
      games_played = doc.get("games_played")
      points_earned = doc.get("points_earned")
  except Exception as e:
    return {"error": str(e)}

  return {"win_loss":win_loss, "games_played":games_played, "points_earned":points_earned}, 200, headers



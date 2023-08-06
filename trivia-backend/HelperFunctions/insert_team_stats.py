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


  if not firebase_admin._apps:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)
  
  db = firestore.client()

  request_json = request.get_json()
  team_id = request_json['team_id']
  stats_month = request_json['stats_month']
  win_loss_ratio = request_json['win_loss_ratio']
  games_played = request_json['games_played']
  points_earned = request_json['points_earned']
  is_update = request_json['is_update']

  

  if is_update == "Y":
    query = db.collection("team-statistics").where("team_id", "==", team_id).where("stats_month", "==", stats_month).get()

    for doc in query:
      new_win_loss = doc.get("win_loss_ratio") + win_loss_ratio
      new_games_played = doc.get("games_played") + games_played
      new_points_earned = doc.get("points_earned") + points_earned
      try:
        doc.reference.update({"win_loss_ratio":new_win_loss, "games_played": new_games_played, "points_earned":new_points_earned})
      except Exception as e:
        return {"error": str(e)}
    
  else:
    stats_data = {
    "team_id": team_id,
    "stats_month": stats_month,
    "win_loss_ratio": win_loss_ratio,
    "games_played": games_played,
    "points_earned": points_earned
    }
    try:
      db.collection("team-statistics").document().set(stats_data)
    except Exception as e:
      return {"error": str(e)}

  return {"message": "Sucess"},200,headers

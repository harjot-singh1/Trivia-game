import base64
import random
import json
import string
import firebase_admin
from firebase_admin import credentials, firestore
import requests
import functions_framework


def generate_team_id(length):
  # Generate a random numeric team ID of specified length
  min_value = 10 ** (length - 1)
  max_value = (10 ** length) - 1
  return random.randint(min_value, max_value)

def get_ai_generated_team_name():
  # Cloud Function URL for retrieving AI-generated team name
  cloud_function_url = "https://us-central1-serverless-391112.cloudfunctions.net/get-team-name"

  try:
    # Make an HTTP GET request to the Cloud Function URL
    response = requests.get(cloud_function_url)

    # Extract the team name from the response
    if response.status_code == 200:
        team_name = response.json().get("team-name")
        return team_name
    else:
        return None

  except:
    return None

@functions_framework.http
def create_team(request):

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
  team_members = request_json['teamMembers']
  sender = request_json['senderId']

  # Generate a random team ID
  team_id = generate_team_id(8)

  # Retrieve AI-generated team name
  team_name = get_ai_generated_team_name()

  if not team_name:
    return {"error": "Failed to retrieve AI-generated team name"}

  current_team = []
  current_team.append(sender)

  team_data = {
    "team_id": str(team_id),
    "requested_members": team_members,
    "team_members": current_team,
    "team_name": team_name,
    "team_admin": sender
    }

  invitation_data = {
    "sender": sender,
    "toTeam": team_id,
    "teamName": team_name,
    "status": 0
  }

  try:
    # Add the team document to Firestore in the "team-details" collection
    db.collection("team-details").document().set(team_data)
    for member in team_members:
      invitation_data["recipient"] = member
      db.collection("team-invitations").document().set(invitation_data)

  except Exception as e:
    return {"error": str(e)}

  response = {"message": "Team created successfully and invitations sent!", "team_id": team_id, "team_name": team_name}
  return (response,200,headers)


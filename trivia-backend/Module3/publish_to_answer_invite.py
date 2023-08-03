from google.cloud import pubsub_v1
import json
import os
from flask import make_response, jsonify
import functions_framework

@functions_framework.http
def publish_answer_team_invite(request):

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

  project_id = "serverless-391112"
  topic_id = "answer-team-invite"

  # Create Pub/Sub publisher client
  publisher = pubsub_v1.PublisherClient()

  request_json = request.get_json()
  docId = request_json['docId']
  status = request_json['status']

  # Format the invitation message payload
  invitation_payload = {
      "docId":docId,
      "status": status
  }

  json_message = json.dumps(invitation_payload).encode('utf-8')

  topic_path = publisher.topic_path(project_id, topic_id)
  future = publisher.publish(topic_path, data=json_message)
  message = "Invitation answered!"

  response = {"message": message}
  return response, 200, headers

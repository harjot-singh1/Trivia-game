import os
from google.cloud import language_v1
import functions_framework

@functions_framework.http
def classify_question(request):

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
  question = request_json['questionText']

  client = language_v1.LanguageServiceClient()
  document = language_v1.Document(content=question, type_=language_v1.Document.Type.PLAIN_TEXT)

  try:
    response = client.classify_text(request={"document": document})
    # print(response)
  except Exception as e:
    print("Inside exception!")
    return f"Error: {str(e)}", 500

  print("End of workflow!")
  categories = [category.name for category in response.categories]

  return {"categories": categories}, 200

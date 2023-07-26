
from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
import dynmo
import json
import base64
import firebase_admin
from firebase_admin import credentials, auth
app = Flask(__name__)
CORS(app, support_credentials=True)

key = {
    "type": "service_account",
	"apiKey": "AIzaSyC__3V_H3bm0Eye-UWqczYnThIlw4jQ86o",
	"authDomain": "tirviaapp.firebaseapp.com",
	"project_id": "tirviaapp",
    "private_key_id": "ca54b97c093e8878a7b2c9ab474c2f607cecba9d",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDnVj94icm40IyQ\n5mza2I+wXQKvitDJD7n8oAGFMlQY9cftNZ/nOttEz28JKTN5lJgWM0qyktzr4ukn\nUkA1YvjQ7TxxYgJ+dLRx5MrYJ4u4iCkblI0Xh7uYqaFh6tkz1b+QNTBKIiZCrKEA\nskLnLlpNFSOJkaNn/Oh0jkpvODcApUtlfCHmHF92PTjzDm4+63z2Jr1IGrOF7uAJ\nnWB5UxgbwWseUhlukKJmnbd1QPD4/XZii2Vukw62BUNy2Ln7RDpW81l/GpGDC1vz\nKQc1utbD031lmpiW7f1He+/00WdnxyrzQm+Rb1C/a711iEqcJqFsnysuKHPj77DK\nSlnzxiahAgMBAAECggEABqJbg4UuEG6fDVu/Ibjyryinr+mS91hYwz6PQWbe8KO0\n/IZC0O9U6o1pV+tDNn7urDpQPG+uRe+15ukHfhBzZfVCIooTqLuhKuzLbWhkhYgw\nGs8HWDZBO/PnZ/O23JmKNH3cZel1syIYvVI5AKcjAB41hleZ7RypY1UeTz/rm3xt\nrki2cEeDR2cSxJNsgOWmaccJGf+uzjgquNVTj3o9SI4z9JLQAerRTd6A8Lq9pqkX\n24bqWyfi/MYJ+zouUokZCaVktSTpxl4+l3kqSU42zIgG3GfoUSFtnpv8o52R9pww\n9sK/iURW8MYLWr09iratAECkY//KJDmUUCjV5Br37QKBgQD3HOjLN69egUOoykye\npcu3qMYrH57q4EdveF4msnsmnYhG9Ws+L9z+pdSuZBGnEvHbXhg+oeFglxgV3+k6\nXQjcriPRpvU4LKpF+fEott5ITdzu7L2jCSb0k8EQygFrl9ISn0ISUvbsHkg91S+D\nMaRaoQY2bHNcxmXHF5KR6GpETQKBgQDvqBf/T3y4pBKVBaLtmHaHP32kGWFFGFjA\nmPokCzwQJBoHhlpitWYH83RReou3dz79As4rX5PBd9IEXkLtXfqWhyfegnlHbaen\nqU9Gh6yd4yAKVI3G9T5JL4RMpU/K3HJ+WWTJF9SuYqlCgtnon58hcw/XViNfwRVT\nVJ4LYY0lpQKBgQCfOW12o+bHyhrCg7di8gmVyZYG61UGmoTs+m4QGSjo9NB+iFwV\nsdl/63Ji+++z660TYEnW8Y+7ISBP1/r7tD6lkz9ZM28GRyFf/XC6fzoy9JjLCpgW\nmSsUpK/eFYtcvHKLtTppfDPGaKy7ysXWjwILs33BS5f5y4yBAFtc0JjIcQKBgDr8\n8eMqqnU8FULO31qB83K4wvEYOiPqqTXGsZMbnM4QRMPjYu323kVIvDGt6yPeWwel\noB926ARvvKbMmMaaIirY24xeKwHU0LZo6xVeIbO/CszgIQF+rbUP2A2RhwFUn23Q\nDQmeLwA5UpYHZSFn4KA4FQcYsZ5JBTm8kyYT/cztAoGALL5U7Tk3CNRQxP2syuGj\ngC+WGpok/yvH2FkcklIz03C6qV63XgdxoU9dduVYIj23sCeWWmIgFgakvzo7zC4p\ntB+c54JdxFbS1V61+FAg6pBFdihWn9DVOXj8DM2RfvN4WhyqysDDvD6EU3LwdOMX\nJfF3jyQmL9bIuIjBw4jAmV0=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-q61gn@tirviaapp.iam.gserviceaccount.com",
    "client_id": "102117213455695409511",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-q61gn%40tirviaapp.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com",
	"storageBucket": "tirviaapp.appspot.com",
	"messagingSenderId": "81613054998",
	"appId": "1:81613054998:web:f02b5d69d7067a594c4137"
}

tableName = 'mfa-question'
# key_string = json.dumps(key)

# # Encode the JSON string as a base64 string
# key_base64 = base64.b64encode(key_string.encode()).decode()
cred = credentials.Certificate(key)
firebase_admin.initialize_app(cred)


@app.route('/verify-token', methods = ['GET'])
def verifyToken():
    try:
        idToken = request.headers.get('idToken')
        # Initialize Firebase Admin SDK
        revoked = auth.verify_id_token(idToken, check_revoked=True)
        print("revoekd 1 ", revoked)
        #auth.revoke_refresh_tokens(revoked['uid'])
        user = auth.get_user(revoked['uid'])
        revoked = auth.verify_id_token(idToken, check_revoked=True)
        print("revoekd 2", revoked)

        print("===================user ")
        #uid = decoded_token['uid']
        return "True"
    except auth.RevokedIdTokenError:
        # The token has been revoked
        print('revoked Id token')
        return "False"
    except auth.UserNotFoundError:
        print("user not found")
        # User not found
        return "False"
    except ValueError as err:
        print(err)
        return {"message":"UnAuthorized", "data":""},401
    except Exception as e:
        return {"message":str(e), "data":""}
    
@app.route('/revoke-token', methods = ['GET'])
@cross_origin(supports_credentials=True)
def revokeToken():
    try:
        idToken = request.headers.get('IdToken')
        print("idtoken", idToken)
        # Initialize Firebase Admin SDK
        revoked = auth.verify_id_token(idToken, check_revoked=True)
        auth.revoke_refresh_tokens(revoked['uid'])
        return "True"
    except auth.RevokedIdTokenError:
        # The token has been revoked
        print('revoked Id token')
        return "False"
    except auth.UserNotFoundError:
        print("user not found")
        # User not found
        return "False"
    except ValueError as err:
        print(err)
        return {"message":"UnAuthorized", "data":""},401
    except Exception as e:
        return {"message":str(e), "data":""}

@app.route('/add-mfa', methods = ['POST'])
@cross_origin(supports_credentials=True)
def addMFA():
    questions = request.json
    tableName = 'mfa-question'
    dynmo.createTable(tableName)
    resp = dynmo.addItems(tableName, questions)
    if resp:
        return {"message":"Data inserted sucessfully", "data":""},200
    else:
        return {"message":"Data insertion fail", "data":""},404




@app.route('/verify-mfa', methods = ['POST'])
def verifyQuestion():
    data = request.json
    resp = dynmo.verifyQuestions(tableName, data)
    if resp:
        return {"message":"Verified", "data":""},200
    else:
        return {"message":"Unverified", "data":""},401
    
@app.route('/email-exist', methods = ['GET'])
def emailExist():
    email = request.args.get("email")
    resp = dynmo.emailExists(tableName, email)
    if resp:
        return {"message":"Email Exists", "data":""},200
    else:
        return {"message":"Email not found", "data":""},404
    

@app.route('/create-profile', methods = ['POST'])
def createProfile():
    data  = request.json
    data["points"] = 0
    data["win"] = 0
    data["total-played"] = 0
    data["loss"] = 0
    # name = data.get('name', None)
    # phoneNumber = data.get('phoneNumber', None)
    try:
        email = data['email']
    except KeyError:
        return {"message":"Email is required", "data":""},400
    
    tableName = "user-data"
    dynmo.createTable(tableName)
    resp = dynmo.addItems(tableName, data)
    if resp:
        return {"message":"Data inserted sucessfully", "data":""},200
    else:
        return {"message":"Data insertion fail", "data":""},404
    



@app.route('/update-profile', methods = ['POST'])
def updateProfile():
    data  = request.json
    email = request.args.get("email")
    tableName = "user-data"
    response = dynmo.update_user(tableName, email, data)
    return {"message":"User data updated", "data": response},200

@app.route('/get-profile', methods = ['GET'])
def getProfile():
    email = request.args.get("email")
    tableName = "user-data"
    profile = dynmo.getItem(tableName, email)
    if profile:
        return {"message":"User data", "data":profile},200
    return {"message":"User not found", "data":""},404

if __name__ == '__main__':
    app.run(host='0.0.0.0',port = 80, debug=True)
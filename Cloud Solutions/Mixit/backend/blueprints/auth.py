import urllib

from flask import Blueprint, redirect, request, session, url_for, jsonify # type: ignore
from identity.web import Auth # type: ignore
from app_config import SCOPE, AUTHORITY, CLIENT_ID, CLIENT_SECRET, ENDPOINT
import requests

auth_blueprint = Blueprint('auth', __name__)

auth = Auth(
    session=session,
    authority=AUTHORITY,
    client_id=CLIENT_ID,
    client_credential=CLIENT_SECRET,
)

@auth_blueprint.route('/login')
def login():
    auth_details = auth.log_in(
        scopes=SCOPE,
        redirect_uri=url_for('auth.auth_response', _external=True),
        prompt="select_account",
    )
    return redirect(auth_details['auth_uri'])

@auth_blueprint.route('/auth_response')
def auth_response():
    result = auth.complete_log_in(request.args)
    session['user'] = result['preferred_username']
    email = session.get('user')
    redirect_url = f"https://vuestorageaccount.z6.web.core.windows.net/?user={urllib.parse.quote(email)}"
    return redirect(redirect_url)
    # return redirect(url_for('db_auth.userDbLogin'))

@auth_blueprint.route("/call_downstream_api")
def call_downstream_api():
    token = auth.get_token_for_user(SCOPE)
    if "error" in token:
        return redirect(url_for("login"))
    
    # Use access token to call downstream API
    response = requests.get(
        ENDPOINT,
        headers={'Authorization': 'Bearer ' + token['access_token']},
        timeout=30,
    )
    
    if response.ok:
        api_result = response.json()
        return jsonify(api_result)
    else:
        return jsonify({"error": "Failed to call downstream API"}), response.status_code
    
@auth_blueprint.route('/checkSession', methods=['GET'])
def check_session():
    if 'user' in session:
        return jsonify({"status": "valid", "user": session['user']}), 200
    else:
        return jsonify({"status": "invalid"}), 401

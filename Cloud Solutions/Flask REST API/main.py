#!/usr/bin/env python
# encoding: utf-8
from flask_api import FlaskAPI, status
from database import data_fetch
app = FlaskAPI(__name__)

# Default Endpoint
@app.route('/', methods=["GET"])
def default():
    return {
        "message": "Hello Cloud Solutions!"
    }, status.HTTP_200_OK

# Fetch Database
@app.route('/fetch', methods=["GET"])
def fetchDatabase():
    data = data_fetch("SELECT * FROM operator;")
    if data is not None:
        return data, status.HTTP_200_OK
    else:
        return { 
            "message": 
            "error" 
        }, status.HTTP_500_INTERNAL_SERVER_ERROR

# Start
app.run(debug=True)
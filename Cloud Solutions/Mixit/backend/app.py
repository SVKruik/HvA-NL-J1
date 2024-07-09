from flask import Flask
from flask_session import Session
from werkzeug.middleware.proxy_fix import ProxyFix
# from blueprints.db_auth import db_auth, init_db
from blueprints.auth import auth_blueprint
from blueprints.main import main_blueprint
from blueprints.endpoint import endpoint
import app_config
from flask_cors import CORS
# from database import db
import os
import logging

app = Flask(__name__)
app.config.from_object(app_config)
app.config['SECRET_KEY'] = 'super_geheim'
app.config['SESSION_COOKIE_HTTPONLY'] = False
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
Session(app)
CORS(app, supports_credentials=True)

# Database configuration from environment variables
# server = os.getenv('DB_SERVER')
# database = os.getenv('DB_NAME')
# username = os.getenv('DB_USERNAME')
# password = os.getenv('DB_PASSWORD')
# driver = os.getenv('DB_DRIVER', 'ODBC Driver 18 for SQL Server')
# connection_string = f'mssql+pyodbc://{username}:{password}@{server}/{database}?driver={driver}'

# app.config['SQLALCHEMY_DATABASE_URI'] = connection_string

# Initialize the database
# db.init_app(app)

# Register blueprints
app.register_blueprint(auth_blueprint)
app.register_blueprint(main_blueprint)
app.register_blueprint(endpoint)
# app.register_blueprint(db_auth)

# Create tables if they do not exist
# with app.app_context():
#     init_db()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)

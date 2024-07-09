# from flask import Flask, Blueprint, session, redirect, url_for, jsonify, request
# from flask_cors import CORS
# from identity.web import Auth  # type: ignore
# from app_config import AUTHORITY, CLIENT_ID, CLIENT_SECRET
# from sqlalchemy.orm import joinedload
# from datetime import datetime
# from database import db
# import urllib.parse
#
# app = Flask(__name__)
# CORS(app)  # Enable CORS for the app
#
# db_auth = Blueprint('db_auth', __name__)
#
# # Database model definitions
# class Admin(db.Model):
#     __tablename__ = 'admin'
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(255), unique=True)
#     creatie_datum = db.Column(db.Date, default=datetime.utcnow)
#     role_id = db.Column(db.Integer, db.ForeignKey('admin_roles.role_id'))
#     role = db.relationship('AdminRole', backref='admins')
#
# class AdminRole(db.Model):
#     __tablename__ = 'admin_roles'
#     role_id = db.Column(db.Integer, primary_key=True)
#     role_name = db.Column(db.String(50))
#
# class FileRecord(db.Model):
#     __tablename__ = 'file_records'
#     id = db.Column(db.Integer, primary_key=True)
#     fileimage_flag = db.Column(db.Boolean)
#     filepath_flag = db.Column(db.Boolean)
#     modifiedauthoremail_flag = db.Column(db.Boolean)
#     modifiedauthorimage_flag = db.Column(db.Boolean)
#     modifiedauthorusername_flag = db.Column(db.Boolean)
#     modifieddate_flag = db.Column(db.Boolean)
#     fileversion_flag = db.Column(db.Boolean)
#     createdauthoremail_flag = db.Column(db.Boolean)
#     createdauthorimage_flag = db.Column(db.Boolean)
#     createdauthorusername_flag = db.Column(db.Boolean)
#     sinceversion_flag = db.Column(db.Boolean)
#     untilversion_flag = db.Column(db.Boolean)
#     size_flag = db.Column(db.Boolean)
#     isfolder_flag = db.Column(db.Boolean)
#
# @db_auth.route('/getRole')
# def roleReturn():
#     if 'user_id' in session:
#         userRole = session['user_role']
#         return userRole
#     return 'No role found'
#
# @db_auth.route('/userDbLogin')
# def userDbLogin():
#     email = session.get('user')
#     if email:
#         user = Admin.query.options(joinedload(Admin.role)).filter_by(email=email).first()
#         if user:
#             session['user_role'] = user.role.role_name
#         else:
#             session['user_role'] = 'noRole'
#         redirect_url = f"https://vuestorageaccount.z6.web.core.windows.net/?user={urllib.parse.quote(email)}"
#         return redirect(redirect_url)
#     return 'No user email found in session', 400
#
# @db_auth.route('/getLogin')
# def getUser():
#     if 'user_role' in session:
#         return session['user'] + ' / ' + session['user_role']
#     else:
#         return 'invalid user'
#
# @db_auth.route('/getFileFlags', methods=['GET'])
# def get_file_records():
#     records = FileRecord.query.all()
#     result = []
#     for record in records:
#         result.append({
#             'fileimage_flag': record.fileimage_flag,
#             'filepath_flag': record.filepath_flag,
#             'modifiedauthoremail_flag': record.modifiedauthoremail_flag,
#             'modifiedauthorimage_flag': record.modifiedauthorimage_flag,
#             'modifiedauthorusername_flag': record.modifiedauthorusername_flag,
#             'modifieddate_flag': record.modifieddate_flag,
#             'fileversion_flag': record.fileversion_flag,
#             'createdauthoremail_flag': record.createdauthoremail_flag,
#             'createdauthorimage_flag': record.createdauthorimage_flag,
#             'createdauthorusername_flag': record.createdauthorusername_flag,
#             'sinceversion_flag': record.sinceversion_flag,
#             'untilversion_flag': record.untilversion_flag,
#             'size_flag': record.size_flag,
#             'isfolder_flag': record.isfolder_flag,
#         })
#     return jsonify(result)
#
# @db_auth.route('/updateFileFlags', methods=['POST'])
# def update_file_flags():
#     data = request.json
#     if not data:
#         return jsonify({'error': 'Invalid input'}), 400
#
#     update_data = {}
#     for key in [
#         'fileimage_flag', 'filepath_flag', 'modifiedauthoremail_flag',
#         'modifiedauthorimage_flag', 'modifiedauthorusername_flag', 'modifieddate_flag',
#         'fileversion_flag', 'createdauthoremail_flag', 'createdauthorimage_flag',
#         'createdauthorusername_flag', 'sinceversion_flag', 'untilversion_flag',
#         'size_flag', 'isfolder_flag'
#     ]:
#         if key in data:
#             update_data[key] = data[key]
#
#     if not update_data:
#         return jsonify({'error': 'No valid flags provided'}), 400
#
#     FileRecord.query.update(update_data)
#     db.session.commit()
#
#     return jsonify({'success': 'File flags updated successfully'})
#
# def init_db():
#     db.create_all()
#     if FileRecord.query.count() == 0:
#         test_record = FileRecord(
#             fileimage_flag=True,
#             filepath_flag=True,
#             modifiedauthoremail_flag=True,
#             modifiedauthorimage_flag=True,
#             modifiedauthorusername_flag=True,
#             modifieddate_flag=True,
#             fileversion_flag=True,
#             createdauthoremail_flag=True,
#             createdauthorimage_flag=True,
#             createdauthorusername_flag=True,
#             sinceversion_flag=True,
#             untilversion_flag=True,
#             size_flag=True,
#             isfolder_flag=True
#         )
#         db.session.add(test_record)
#         db.session.commit()
#
# app.register_blueprint(db_auth)
#
# if __name__ == '__main__':
#     app.run(debug=True)

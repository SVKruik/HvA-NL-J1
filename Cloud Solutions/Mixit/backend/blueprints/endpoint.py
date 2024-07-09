import base64
import os.path

from flask import Blueprint, abort, request, send_file
import requests
import json

from utils import file_creation

endpoint = Blueprint('endpoint', __name__)


@endpoint.route('/fileDetails/<int:fileId>', methods=["GET"])
def fetchFileDetails(fileId):
    url = 'https://prod-191.westeurope.logic.azure.com:443/workflows/004fe3f5881f4a0793d82ff11a1f3a37/triggers/manual/paths/invoke'

    # Dictionary met query parameters
    params = {
        'api-version': '2016-06-01',
        'sp': '/triggers/manual/run',
        'sv': '1.0',
        'sig': 'eHUkbw8rPJ6JEJ9BzztuZmdavhSPP92GGyXUdOWkkZ8'
    }

    response = requests.post(url, json={'fileId': fileId}, params=params)
    status_code = response.status_code
    if status_code == 200:
        responseData = json.dumps(json.loads(response.text))
        return responseData, 200
    elif 100 <= status_code < 600:
        abort(status_code)
    else:
        abort(500)


@endpoint.route('/fileOverview', methods=["GET"])
def fetchFileOverview():
    url = 'https://prod-173.westeurope.logic.azure.com:443/workflows/4f1561b6ac6743d98c6f1963d4522cf8/triggers/manual/paths/invoke'

    # Dictionary met query parameters
    params = {
        'api-version': '2016-06-01',
        'sp': '/triggers/manual/run',
        'sv': '1.0',
        'sig': 'lJPTCNb1ktcUUHD4Gm47_0e1bmBB7JcZnlfz7DJtPsU'
    }

    response = requests.post(url, params=params)
    status_code = response.status_code
    if status_code == 200:
        return response.text, 200
    elif 100 <= status_code < 600:
        abort(status_code)
    else:
        abort(500)


@endpoint.route('/fileAuthorOverview/<string:email>', methods=["GET"])
def fetchFileAuthorOverview(email):
    url = "https://prod-226.westeurope.logic.azure.com:443/workflows/52f3114f312440fbaf6e48c250f78cf8/triggers/manual/paths/invoke"
    params = {
        'api-version': '2016-06-01',
        'sp': '/triggers/manual/run',
        'sv': '1.0',
        'sig': 'lT6gZDvXPhsLTNrFciT7uZirPgURQhiUWPr4y-Rx1fI'
    }
    response = requests.post(url, params=params, json={'email': email})
    status_code = response.status_code
    if status_code == 200:
        return response.text, 200
    elif 100 <= status_code < 600:
        abort(status_code)
    else:
        abort(500)


@endpoint.route('/recentFiles/<string:email>/<int:limit>', methods=["GET"])
def fetchRecentFiles(email, limit):
    url = 'https://prod-142.westeurope.logic.azure.com:443/workflows/a4c5c24d36334253b5647a49ce6ce88a/triggers/manual/paths/invoke'

    # Dictionary met query parameters
    params = {
        'api-version': '2016-06-01',
        'sp': '/triggers/manual/run',
        'sv': '1.0',
        'sig': '0SR31q44tI49Um_wAbrRG-bD4zwHK8iXqMJhVprnwtI'
    }
    response = requests.post(url, params=params, json={'email': email, 'limit': limit})
    status_code = response.status_code
    if status_code == 200:
        return response.text, 200
    elif 100 <= status_code < 600:
        abort(status_code)
    else:
        abort(500)


@endpoint.route('/userDetails/<string:email>', methods=["GET"])
def fetchUserDetails(email):
    url = 'https://prod-87.westeurope.logic.azure.com:443/workflows/ee75f0b60ea14319bd94f32b15ddb754/triggers/manual/paths/invoke'

    # Dictionary met query parameters
    params = {
        'api-version': '2016-06-01',
        'sp': '/triggers/manual/run',
        'sv': '1.0',
        'sig': 'oFlDtq7x9ymceLnmD_9aY8VxeJbkJllMbE_DNtKTgBc'
    }
    response = requests.post(url, params=params, json={'email': email})
    status_code = response.status_code
    if status_code == 200:
        responseData = json.dumps(json.loads(response.text))
        return responseData, 200
    elif 100 <= status_code < 600:
        abort(status_code)
    else:
        abort(500)


@endpoint.route('/fileCreate', methods=["POST"])
def fetchFileCreate():
    file_data = request.json
    print(file_data)
    if file_data is None:
        abort(400, 'No data provided')
    if 'title' not in file_data or 'subtitle' not in file_data or 'type' not in file_data:
        abort(400, 'Invalid data provided')
    if file_data['type'] == 'PowerPoint':
        try:
            file_name = file_creation.create_pptx(file_data['title'], file_data['subtitle'])
            if os.path.isfile(file_name):
                if file_data['getPreview']:
                    file_name = file_creation.get_preview_image(file_name)
                    return send_file(file_name, mimetype='image/png')
                else:
                    response = uploadFile(file_name)
                    os.remove(file_name)
                    if response is not None:
                        return response, 200
                    else:
                        abort(500, 'Failed to upload file')
            else:
                abort(500, 'Failed to create file')
        except Exception as e:
            print(e)
            abort(500, str(e))
    elif file_data['type'] == 'Word':
        try:
            file_name = file_creation.create_docx(file_data['title'], file_data['subtitle'])
            if os.path.isfile(file_name):
                if file_data['getPreview']:
                    file_name = file_creation.get_preview_image(file_name)
                    return send_file(file_name, mimetype='image/png')
                else:
                    response = uploadFile(file_name)
                    os.remove(file_name)
                    if response is not None:
                        return response, 200
                    else:
                        abort(500, 'Failed to upload file')
            else:
                abort(500, 'Failed to create file')
        except Exception as e:
            print(e)
            abort(500, str(e))
    abort(400, 'Invalid request')


def uploadFile(file_name: str):
    url = 'https://prod-88.westeurope.logic.azure.com:443/workflows/a553b4d0038f4245986d04c08ca0e749/triggers/manual/paths/invoke'
    params = {
        'api-version': '2016-06-01',
        'sp': '/triggers/manual/run',
        'sv': '1.0',
        'sig': 'O81_5jhsD8ta-Z2a1n3WV62JMWyag20rLJQTN00ues4'
    }
    with open(file_name, 'rb') as file:
        file_data_encoded = base64.b64encode(file.read()).decode('ascii')
    response = requests.post(url, params=params, json={'fileName': file_name, 'data': file_data_encoded})
    if response.status_code == 200:
        return response.json()
    else:
        return None


@endpoint.route('/fileColumns', methods=["GET"])
def fetchFileColumns():
    temporary_mock_data = [
        {
            'dbName':'createdauthoremail_flag',
            'displayName':'Author Email',
            'fieldName':'authorEmail',
            'value': True,
        },
        {
            'dbName':'createdauthorimage_flag',
            'displayName':'Author Image',
            'fieldName':'creatorImage',
            'value': True,
        },
        {
            'dbName':'createdauthorusername_flag',
            'displayName':'Author Username',
            'fieldName':'createdUsername',
            'value': True,
        },
        {
            'dbName':'fileimage_flag',
            'displayName':'File Image',
            'fieldName':'fileImage',
            'value': True,
        },
        {
            'dbName':'filepath_flag',
            'displayName':'File Path',
            'fieldName':'filePath',
            'value': True,
        },
        {
            'dbName':'fileversion_flag',
            'displayName':'File Version',
            'fieldName':'fileVersion',
            'value': True,
        },
        {
            'dbName':'isfolder_flag',
            'displayName':'Is Folder',
            'fieldName':'isFolder',
            'value': True,
        },
        {
            'dbName':'modifiedauthoremail_flag',
            'displayName':'Modified Author Email',
            'fieldName':'modifiedByEmail',
            'value': True,
        },
        {
            'dbName':'modifiedauthorimage_flag',
            'displayName':'Modified Author Image',
            'fieldName':'modifiedByImage',
            'value': True,
        },
        {
            'dbName':'modifiedauthorusername_flag',
            'displayName':'Modified Author Username',
            'fieldName':'modifiedByName',
            'value': True,
        },
        {
            'dbName':'modifieddate_flag',
            'displayName':'Modified Date',
            'fieldName':'lastModifiedDate',
            'value': True,
        }
    ]
    return json.dumps(temporary_mock_data), 200

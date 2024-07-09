from flask import Blueprint, redirect, render_template, session, url_for

main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/')
def home():
    if 'user' in session:
        return render_template('index.html', user=session['user'])
    else:
        return redirect(url_for('auth.login'))

@main_blueprint.route("/logout")
def logout():
    session.clear()
    return redirect(url_for('auth.login'))  

@main_blueprint.route('/fetch', methods=["GET"])
def fetch_database():
    data = data_fetch("SELECT * FROM operator;")
    if data is not None:
        return data, status.HTTP_200_OK
    else:
        return { 
            "message": "error" 
        }, status.HTTP_500_INTERNAL_SERVER_ERROR
    


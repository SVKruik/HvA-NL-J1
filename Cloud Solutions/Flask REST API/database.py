import mysql.connector.pooling
from dotenv import load_dotenv
import os

# Database Setup
load_dotenv()
db_config = {
    'pool_name': "cloud_solutions_flask",
    'pool_size': 5,
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_DATABASE')
}
connection_pool = mysql.connector.pooling.MySQLConnectionPool(**db_config)

# Database Fetch
def data_fetch(query):
    try:
        connection = connection_pool.get_connection()
        cursor = connection.cursor()
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        connection.close()
        return data
    except mysql.connector.Error as error:
        print(error)
        return None

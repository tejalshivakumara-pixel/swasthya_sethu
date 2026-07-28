import os
import mysql.connector
from dotenv import load_dotenv
load_dotenv()

class DBConnection:

    @staticmethod
    def get_connection():
        try:
            connection = mysql.connector.connect(
                host=os.environ.get("DB_HOST", "localhost"),
                user=os.environ.get("DB_USER", "root"),
                password=os.environ.get("DB_PASSWORD", ""),
                database=os.environ.get("DB_NAME", "database"),
            )
            return connection

        except mysql.connector.Error as err:
            print("Database Connection Error:", err)
            return None
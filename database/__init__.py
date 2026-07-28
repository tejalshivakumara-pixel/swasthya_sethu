import mysql.connector
from mysql.connector import Error


class DatabaseConnection:

    def __init__(self):
        self.host = "localhost"
        self.user = "root"
        self.password = "tejal@2005"
        self.database = "swasthya_setu_v2"

    def get_connection(self):
        try:
            connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )

            if connection.is_connected():
                print("✅ MySQL Connected Successfully")
                return connection

        except Error as e:
            print("Database Connection Error:", e)

        return None


db = DatabaseConnection()
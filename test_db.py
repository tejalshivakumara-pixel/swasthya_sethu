from database.db_connection import DBConnection

conn = DBConnection.get_connection()

if conn:
    print("✅ Database Connected Successfully!")
    conn.close()
else:
    print("❌ Connection Failed!")
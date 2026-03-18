import sqlite3
import os

db_path = "backend-fastapi/dev.db"
if not os.path.exists(db_path):
    print(f"Database {db_path} not found.")
else:
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    try:
        cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cur.fetchall()
        print(f"Tables found: {[t[0] for t in tables]}")
    except Exception as e:
        print(f"Query failed: {e}")
    finally:
        conn.close()

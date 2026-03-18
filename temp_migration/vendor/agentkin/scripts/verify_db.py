import sqlite3
import os

db_path = "backend-fastapi/dev.db"
if not os.path.exists(db_path):
    print(f"Database {db_path} not found.")
else:
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, title, status, budget, createdAt FROM KinTask ORDER BY createdAt DESC LIMIT 5")
        tasks = cur.fetchall()
        print(f"Total tasks found: {len(tasks)}")
        for t in tasks:
            print(f"ID: {t[0]} | Title: {t[1]} | Status: {t[2]} | Budget: {t[3]} | CreatedAt: {t[4]}")
        
        cur.execute("SELECT count(*) FROM PlatformRevenue")
        rev_count = cur.fetchone()[0]
        print(f"Revenue records: {rev_count}")
    except Exception as e:
        print(f"Query failed: {e}")
    finally:
        conn.close()

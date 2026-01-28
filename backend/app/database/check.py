#!/usr/bin/env python3
"""Wait for Postgres and create the target database if it doesn't exist."""
import os
import sys
import time
from psycopg import connect
from psycopg import sql

def main():
    host = os.getenv("PG_HOST", "db")
    port = int(os.getenv("PG_PORT", "5432"))
    user = os.getenv("PG_USER", "postgres")
    password = os.getenv("PG_PASSWORD", "")
    target_db = os.getenv("PG_DB", "full_stack_template_db")

    while True:
        try:
            with connect(host=host, port=port, user=user, password=password, dbname="postgres", connect_timeout=2) as conn:
                conn.autocommit = True
                with conn.cursor() as cur:
                    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (target_db,))
                    if cur.fetchone():
                        print(f"Database '{target_db}' already exists.")
                    else:
                        print(f"Creating database '{target_db}'.")
                        cur.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(target_db)))
            return 0
        except Exception as exc:
            print(f"Waiting for Postgres at {host}:{port}... ({exc})", file=sys.stderr)
            time.sleep(1)

if __name__ == "__main__":
    sys.exit(main())
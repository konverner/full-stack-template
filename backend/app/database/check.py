#!/usr/bin/env python3
"""Wait for Postgres and create the target database if it doesn't exist."""
import sys
import time

from psycopg import connect, sql

from app.config import settings


def main():
    host = settings.PG_HOST
    port = settings.PG_PORT
    user = settings.PG_USER
    password = settings.PG_PASSWORD
    target_db = settings.PG_DB

    if not target_db:
        print("PG_DB is not set. Skipping database existence check.")
        return 0

    while True:
        try:
            with connect(
                host=host,
                port=port,
                user=user,
                password=password,
                dbname="postgres",
                connect_timeout=2,
            ) as conn:
                conn.autocommit = True
                with conn.cursor() as cur:
                    cur.execute(
                        "SELECT 1 FROM pg_database WHERE datname = %s", (target_db,)
                    )
                    if cur.fetchone():
                        print(f"Database '{target_db}' already exists.")
                    else:
                        print(f"Creating database '{target_db}'.")
                        cur.execute(
                            sql.SQL("CREATE DATABASE {}").format(
                                sql.Identifier(target_db)
                            )
                        )
            return 0
        except Exception as exc:
            print(f"Waiting for Postgres at {host}:{port}... ({exc})", file=sys.stderr)
            time.sleep(1)


if __name__ == "__main__":
    sys.exit(main())

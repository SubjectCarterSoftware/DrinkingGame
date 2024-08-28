import psycopg2
from psycopg2 import sql
import time

# Database connection details
DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "mysecretpassword"

# Number of attempts to connect to PostgreSQL
MAX_ATTEMPTS = 5
RETRY_DELAY = 5  # seconds

# Function to connect to the PostgreSQL database
def connect_to_postgres(attempts=MAX_ATTEMPTS):
    while attempts > 0:
        try:
            conn = psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD
            )
            print("Connected to the database.")
            return conn
        except psycopg2.OperationalError as e:
            print(f"Connection failed: {e}")
            attempts -= 1
            if attempts > 0:
                print(f"Retrying in {RETRY_DELAY} seconds... ({attempts} attempts left)")
                time.sleep(RETRY_DELAY)
            else:
                print("Max attempts reached. Could not connect to the database.")
                exit(1)

# Connect to PostgreSQL with retry logic
conn = connect_to_postgres()

# Create a cursor object
cur = conn.cursor()

# Read and execute the schema.sql file
try:
    with open('schema.sql', 'r') as schema_file:
        schema_sql = schema_file.read()
        cur.execute(schema_sql)
        conn.commit()
        print("Database schema applied successfully.")
except Exception as e:
    print(f"Error applying schema: {e}")

# Hardcoded dummy users with consistent UUIDs and assigned lobbies
dummy_users = [
    ("123e4567-e89b-12d3-a456-426614174001", "PlayerOne", "000001"),
    ("123e4567-e89b-12d3-a456-426614174002", "PlayerTwo", "000001"),
    ("123e4567-e89b-12d3-a456-426614174003", "PlayerThree", "000002"),
    ("123e4567-e89b-12d3-a456-426614174004", "PlayerFour", "000002"),
    ("123e4567-e89b-12d3-a456-426614174005", "PlayerFive", "000003"),
    ("123e4567-e89b-12d3-a456-426614174006", "PlayerSix", "000003"),
    ("123e4567-e89b-12d3-a456-426614174007", "PlayerSeven", "000004"),
    ("123e4567-e89b-12d3-a456-426614174008", "PlayerEight", "000004"),
    ("123e4567-e89b-12d3-a456-426614174009", "PlayerNine", "000005"),
    ("123e4567-e89b-12d3-a456-426614174010", "PlayerTen", "000005")
]

# Insert the hardcoded dummy users into the players table
insert_players_query = sql.SQL("""
    INSERT INTO players (id, nickname, lobby_id) VALUES (%s, %s, %s)
""")

# Hardcoded dummy lobbies with host IDs
dummy_lobbies = [
    ("000001", 1, False, "123e4567-e89b-12d3-a456-426614174001"),  # PlayerOne is the host
    ("000002", 2, True, "123e4567-e89b-12d3-a456-426614174003"),   # PlayerThree is the host
    ("000003", 3, False, "123e4567-e89b-12d3-a456-426614174005"),  # PlayerFive is the host
    ("000004", 4, True, "123e4567-e89b-12d3-a456-426614174007"),   # PlayerSeven is the host
    ("000005", 5, False, "123e4567-e89b-12d3-a456-426614174009")   # PlayerNine is the host
]

# Insert the dummy lobbies into the lobbies table
insert_lobbies_query = sql.SQL("""
    INSERT INTO lobbies (lobby_id, pod_id, is_full, host_id) VALUES (%s, %s, %s, %s)
""")

try:
    cur.executemany(insert_players_query, dummy_users)
    cur.executemany(insert_lobbies_query, dummy_lobbies)
    conn.commit()  # Commit the transactions
    print("Inserted dummy users into 'players' table and dummy lobbies into 'lobbies' table.")
except Exception as e:
    print(f"Error inserting dummy data: {e}")

# Fetch and check the contents of the players table
try:
    cur.execute("SELECT COUNT(*) FROM players;")
    row_count_players = cur.fetchone()[0]
    expected_count_players = len(dummy_users)
    if row_count_players == expected_count_players:
        print(f"Table 'players' populated successfully with {row_count_players} entries.")
    else:
        print(f"Expected {expected_count_players} entries, but found {row_count_players}.")
except Exception as e:
    print(f"Error querying the 'players' table: {e}")

# Fetch and check the contents of the lobbies table
try:
    cur.execute("SELECT COUNT(*) FROM lobbies;")
    row_count_lobbies = cur.fetchone()[0]
    expected_count_lobbies = len(dummy_lobbies)
    if row_count_lobbies == expected_count_lobbies:
        print(f"Table 'lobbies' populated successfully with {row_count_lobbies} entries.")
    else:
        print(f"Expected {expected_count_lobbies} entries, but found {row_count_lobbies}.")
except Exception as e:
    print(f"Error querying the 'lobbies' table: {e}")

# Close the cursor and connection
cur.close()
conn.close()
print("Database operations completed.")

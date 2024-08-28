import requests
import json
import os

# Set this environment variable to True or False
DETAILED_LOGGING = os.getenv('DETAILED_LOGGING', 'True').lower() == 'false'

# Base URL for the API
BASE_URL = "http://localhost:8080"

# Function to make a POST request and return the JSON response
def post_request(url, data=None):
    response = requests.post(url, json=data)
    if response.status_code == 200:
        return response.json()
    else:
        if DETAILED_LOGGING:
            print(f"Error: {response.status_code}")
            print(response.text)
        return None

# 1. Test Create New Player
def test_create_new_player():
    if DETAILED_LOGGING:
        print("Testing Create New Player...")
    url = f"{BASE_URL}/create-new-player"
    response = post_request(url)
    if response and "player_id" in response and "nickname" in response:
        if DETAILED_LOGGING:
            print("Create New Player Success:", json.dumps(response, indent=2))
        return response["player_id"]
    else:
        if DETAILED_LOGGING:
            print("Create New Player Failed")
        return None

# 2. Test Create Lobby
def test_create_lobby(host_id):
    if DETAILED_LOGGING:
        print("Testing Create Lobby...")
    url = f"{BASE_URL}/create-lobby"
    data = {
        "host_id": host_id  # Updated to match the Go struct field
    }
    response = post_request(url, data)
    if response and "lobby_id" in response and "pod_id" in response:
        if DETAILED_LOGGING:
            print("Create Lobby Success:", json.dumps(response, indent=2))
        return response["lobby_id"]
    else:
        if DETAILED_LOGGING:
            print("Create Lobby Failed")
        return None

# 3. Test Leave Lobby
def test_leave_lobby(player_id):
    if DETAILED_LOGGING:
        print("Testing Leave Lobby...")
    url = f"{BASE_URL}/leave-lobby"
    data = {
        "player_id": player_id  # Update the key to match the Go struct field
    }
    response = post_request(url, data)
    if response and "message" in response:
        if DETAILED_LOGGING:
            print("Leave Lobby Success:", json.dumps(response, indent=2))
    else:
        if DETAILED_LOGGING:
            print("Leave Lobby Failed")
        return False
    return True


# 4. Test Join Lobby
def test_join_lobby(player_id, lobby_id):
    if DETAILED_LOGGING:
        print("Testing Join Lobby...")
    url = f"{BASE_URL}/join-lobby"
    data = {
        "player_id": player_id,  # Updated to match the Go struct field
        "lobby_id": lobby_id   # Updated to match the Go struct field
    }
    response = post_request(url, data)
    if response and "lobby_id" in response and "pod_id" in response:
        if DETAILED_LOGGING:
            print("Join Lobby Success:", json.dumps(response, indent=2))
    else:
        if DETAILED_LOGGING:
            print("Join Lobby Failed")
        return False
    return True

# 5. Test Delete Lobby by Host Leaving
def test_host_leaves_and_deletes_lobby():
    if DETAILED_LOGGING:
        print("Testing Host Leaves and Deletes Lobby...")
    # Create a new player (who will be the host)
    host_id = test_create_new_player()
    if not host_id:
        return "test_create_new_player (host)"

    # Create a lobby with this host
    lobby_id = test_create_lobby(host_id)
    if not lobby_id:
        return "test_create_lobby"

    # Host leaves the lobby, which should delete the lobby
    if not test_leave_lobby(host_id):
        return "test_leave_lobby"
    
    return None

# Main function to run all tests
def main():
    errors = []

    # Step 1: Create the first player (host)
    host_id = test_create_new_player()
    if host_id:
        # Step 2: Create a lobby with the first player as the host
        lobby_id = test_create_lobby(host_id)
        if lobby_id:
            # Step 3: Create a second player
            second_player_id = test_create_new_player()
            if second_player_id:
                # Step 4: Join the lobby with the second player
                if not test_join_lobby(second_player_id, lobby_id):
                    errors.append("test_join_lobby")
                # Step 5: Leave the lobby with the second player
                if not test_leave_lobby(second_player_id):
                    errors.append("test_leave_lobby")
            else:
                errors.append("test_create_new_player (second player)")
        else:
            errors.append("test_create_lobby")
    else:
        errors.append("test_create_new_player (host)")

    # Step 6: Test a host creating and then leaving (which deletes) a lobby
    host_leaves_error = test_host_leaves_and_deletes_lobby()
    if host_leaves_error:
        errors.append(host_leaves_error)

    if not DETAILED_LOGGING:
        if errors:
            print("Tests failed:", ", ".join(errors))
        else:
            print("All Pass")

if __name__ == "__main__":
    main()

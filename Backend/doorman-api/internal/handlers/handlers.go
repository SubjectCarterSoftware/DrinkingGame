package handlers

import (
	"doorman-api/internal/database"
	"doorman-api/models"
	"encoding/json"
	"log"
	"net/http"
)

// CreateNewPlayerID handles the creation of a new player and returns the player's ID and nickname
func CreateNewPlayerID(w http.ResponseWriter, r *http.Request) {
	log.Println("CreateNewPlayerID: Received request to create new player.")

	player, err := database.CreateNewPlayerID()
	if err != nil {
		log.Printf("CreateNewPlayerID: Error creating new player - %v", err)
		http.Error(w, "Failed to create new player", http.StatusInternalServerError)
		return
	}

	log.Printf("CreateNewPlayerID: Player created successfully with ID %s.", player.ID)
	// Return the created player details
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":   "Player created successfully",
		"player_id": player.ID,
		"nickname":  player.Nickname,
	})
	log.Println("CreateNewPlayerID: Response sent successfully.")
}

// CreateLobby handles the creation of a new lobby and returns the lobby details
func CreateLobby(w http.ResponseWriter, r *http.Request) {
	log.Println("CreateLobby: Received request to create new lobby.")

	var lobby models.Lobby
	err := json.NewDecoder(r.Body).Decode(&lobby)
	if err != nil || lobby.HostID == "" {
		log.Printf("CreateLobby: Invalid request payload - %v", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("CreateLobby: Creating lobby for host ID %s.", lobby.HostID)
	// Set defaults
	lobby.PodID = 1 // Assuming PodID is set to 1 by default
	lobby.IsFull = false

	// Create the lobby and return the lobby ID and Pod ID
	lobbyID, podID, err := database.CreateLobby(&lobby, lobby.HostID)
	if err != nil {
		log.Printf("CreateLobby: Error creating lobby - %v", err)
		http.Error(w, "Failed to create lobby", http.StatusInternalServerError)
		return
	}

	log.Printf("CreateLobby: Lobby created successfully with ID %s and host ID %s.", lobbyID, lobby.HostID)
	// Return the created lobby details, including the host ID
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":  "Lobby created successfully",
		"lobby_id": lobbyID,
		"pod_id":   podID,
		"host_id":  lobby.HostID,
	})
	log.Println("CreateLobby: Response sent successfully.")
}

// LeaveLobby handles the request for a player to leave a lobby
func LeaveLobby(w http.ResponseWriter, r *http.Request) {
	log.Println("LeaveLobby: Received request to leave lobby.")

	var req models.Player
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil || req.ID == "" {
		log.Printf("LeaveLobby: Invalid request payload - %v", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("LeaveLobby: Player ID %s leaving lobby.", req.ID)
	// Set the lobby ID to NULL (or zero) for the player
	err = database.SetLobbyForPlayer(req.ID, "0") // Assuming "0" is used to indicate no lobby
	if err != nil {
		log.Printf("LeaveLobby: Error leaving lobby - %v", err)
		http.Error(w, "Failed to leave lobby", http.StatusInternalServerError)
		return
	}

	// Attempt to delete the lobby if the player is the host
	err = database.DeleteLobbyByHostID(req.ID)
	if err == nil {
		log.Printf("LeaveLobby: Lobby hosted by player ID %s has been deleted.", req.ID)
	} else if err.Error() != "no lobby found with the provided host ID" {
		log.Printf("LeaveLobby: Error deleting lobby - %v", err)
	}

	log.Printf("LeaveLobby: Player ID %s left lobby successfully.", req.ID)
	// Return success message
	json.NewEncoder(w).Encode(map[string]string{"message": "Player left lobby successfully"})
	log.Println("LeaveLobby: Response sent successfully.")
}

// JoinLobby handles the request for a player to join a lobby
func JoinLobby(w http.ResponseWriter, r *http.Request) {
	log.Println("JoinLobby: Received request to join lobby.")

	var req models.PlayerLobbyRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil || req.PlayerID == "" || req.LobbyID == "" {
		log.Printf("JoinLobby: Invalid request payload - %v", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("JoinLobby: Player ID %s attempting to join lobby ID %s.", req.PlayerID, req.LobbyID)
	// Retrieve the lobby details
	lobby, err := database.GetLobby(req.LobbyID)
	if err != nil {
		log.Printf("JoinLobby: Error retrieving lobby details - %v", err)
		http.Error(w, "Failed to retrieve lobby details", http.StatusInternalServerError)
		return
	}

	// Check if the lobby is full
	if lobby.IsFull {
		log.Printf("JoinLobby: Lobby ID %s is full.", req.LobbyID)
		json.NewEncoder(w).Encode(map[string]string{"message": "Lobby is full"})
		return
	}

	// Set the lobby ID for the player
	err = database.SetLobbyForPlayer(req.PlayerID, req.LobbyID)
	if err != nil {
		log.Printf("JoinLobby: Error joining lobby - %v", err)
		http.Error(w, "Failed to join lobby", http.StatusInternalServerError)
		return
	}

	log.Printf("JoinLobby: Player ID %s joined lobby ID %s successfully.", req.PlayerID, req.LobbyID)
	// Return success with lobby details
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":  "Player joined lobby successfully",
		"lobby_id": lobby.ID,
		"pod_id":   lobby.PodID,
	})
	log.Println("JoinLobby: Response sent successfully.")
}

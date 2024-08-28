package database

import (
	"context"
	"database/sql"
	"doorman-api/models"
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

var db *sql.DB

// InitDB initializes the database connection
func InitDB(dataSourceName string) error {
	var err error
	db, err = sql.Open("postgres", dataSourceName)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}
	if err = db.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}
	return nil
}

// IsDBAlive checks if the database connection is still alive
func IsDBAlive() bool {
	if db == nil {
		return false
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	err := db.PingContext(ctx)
	if err != nil {
		log.Printf("Database ping failed: %v", err)
		return false
	}
	return true
}

// GetLobby returns all columns from the lobby table for the row matching the lobby_id
func GetLobby(lobbyID string) (*models.Lobby, error) {
	var lobby models.Lobby
	query := "SELECT lobby_id, pod_id, is_full, host_id FROM lobbies WHERE lobby_id = $1"
	err := db.QueryRow(query, lobbyID).Scan(&lobby.ID, &lobby.PodID, &lobby.IsFull, &lobby.HostID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("lobby not found: %w", err)
		}
		return nil, fmt.Errorf("failed to get lobby: %w", err)
	}
	return &lobby, nil
}

// GetPlayer returns all columns from the player table for the row matching the player_id
func GetPlayer(playerID string) (*models.Player, error) {
	var player models.Player
	query := "SELECT id, nickname, lobby_id FROM players WHERE id = $1"
	err := db.QueryRow(query, playerID).Scan(&player.ID, &player.Nickname, &player.LobbyID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("player not found: %w", err)
		}
		return nil, fmt.Errorf("failed to get player: %w", err)
	}
	return &player, nil
}

// DeleteLobby deletes the lobby row from the lobby table for the lobby_id that was passed in
func DeleteLobby(lobbyID string) error {
	query := "DELETE FROM lobbies WHERE lobby_id = $1"
	_, err := db.Exec(query, lobbyID)
	if err != nil {
		return fmt.Errorf("failed to delete lobby: %w", err)
	}
	return nil
}

// DeleteLobbyByHostID deletes the lobby row(s) from the lobbies table where the host_id matches the provided hostID
func DeleteLobbyByHostID(playerID string) error {
	query := "DELETE FROM lobbies WHERE host_id = $1"
	result, err := db.Exec(query, playerID)
	if err != nil {
		return fmt.Errorf("failed to delete lobby by player ID: %w", err)
	}

	// Check how many rows were affected
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to check rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no lobby found with the provided player ID")
	}

	return nil
}

// SetLobbyForPlayer sets the lobby_id for the player on the players table for the player_id that was passed in
func SetLobbyForPlayer(playerID, lobbyID string) error {
	query := "UPDATE players SET lobby_id = $1 WHERE id = $2"
	_, err := db.Exec(query, lobbyID, playerID)
	if err != nil {
		return fmt.Errorf("failed to set lobby for player: %w", err)
	}
	return nil
}

// SetLobbyFull sets the lobby status to full for the lobby_id that was passed in
func SetLobbyFull(lobbyID string) error {
	query := "UPDATE lobbies SET is_full = TRUE WHERE lobby_id = $1"
	_, err := db.Exec(query, lobbyID)
	if err != nil {
		return fmt.Errorf("failed to set lobby to full: %w", err)
	}
	return nil
}

// CreateNewPlayerID creates a new player ID with a random nickname and ensures it's not an existing ID in the players table
func CreateNewPlayerID() (*models.Player, error) {
	var player models.Player
	for {
		player.ID = uuid.New().String()
		player.Nickname = fmt.Sprintf("Player_%d", rand.Intn(10000))

		// Insert the new player, break the loop if successful
		query := "INSERT INTO players (id, nickname) VALUES ($1, $2)"
		_, err := db.Exec(query, player.ID, player.Nickname)
		if err == nil {
			break
		}
		if err != nil && !isUniqueViolation(err) {
			return nil, fmt.Errorf("failed to create new player: %w", err)
		}
	}
	return &player, nil
}

// CreateLobby creates a new lobby and assigns the requesting player as the host
func CreateLobby(lobby *models.Lobby, hostID string) (string, int, error) {
	for {
		lobby.ID = fmt.Sprintf("%06d", rand.Intn(999999))

		// Check if the generated lobby ID already exists
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM lobbies WHERE lobby_id = $1)", lobby.ID).Scan(&exists)
		if err != nil {
			return "", 0, fmt.Errorf("failed to check if lobby ID exists: %w", err)
		}
		if !exists {
			break // Unique lobby ID found
		}
	}

	// Insert the new lobby into the database with the host ID
	query := "INSERT INTO lobbies (lobby_id, pod_id, is_full, host_id) VALUES ($1, $2, $3, $4)"
	_, err := db.Exec(query, lobby.ID, lobby.PodID, lobby.IsFull, hostID)
	if err != nil {
		return "", 0, fmt.Errorf("failed to create lobby: %w", err)
	}

	// Return the created lobby ID and Pod ID
	return lobby.ID, lobby.PodID, nil
}

// Helper function to check if the error is a unique constraint violation
func isUniqueViolation(err error) bool {
	pgErr, ok := err.(*pq.Error)
	return ok && pgErr.Code == "23505"
}

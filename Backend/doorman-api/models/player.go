package models

// Player represents a player in the system
type Player struct {
	ID       string  `json:"player_id"`
	Nickname string  `json:"nickname"`
	LobbyID  *string `json:"lobby_id,omitempty"` // LobbyID is a pointer to allow for NULL values
}

type PlayerLobbyRequest struct {
	PlayerID string `json:"player_id"`
	LobbyID  string `json:"lobby_id"`
}

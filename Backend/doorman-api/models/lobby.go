package models

// Lobby represents a gaming lobby
type Lobby struct {
	ID     string `json:"lobby_id"`
	PodID  int    `json:"pod_id"`
	IsFull bool   `json:"is_full"`
	HostID string `json:"host_id"` // Add the host ID field
}

// Requests
type CheckLobbyRequest struct {
	LobbyID string `json:"lobby_id"`
}

type CreatePlayerResponse struct {
	ID       string `json:"player_id"`
	Nickname string `json:"nickname"`
}

type SetNicknameRequest struct {
	PlayerID    string `json:"player_id"`
	NewNickname string `json:"new_nickname"`
}

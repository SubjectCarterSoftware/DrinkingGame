-- schema.sql

-- Create the 'players' table
CREATE TABLE IF NOT EXISTS players (
    -- 'id' is the primary key for the players table, using the UUID type for uniqueness
    id UUID PRIMARY KEY,
    
    -- 'nickname' stores the player's chosen nickname, up to 50 characters
    nickname VARCHAR(50) NOT NULL,
    
    -- 'lobby_id' stores the ID of the lobby the player is currently in
    -- CHAR(6) ensures that the lobby ID is always 6 characters, potentially with leading zeros
    lobby_id CHAR(6)
);

-- Create the 'lobbies' table
CREATE TABLE IF NOT EXISTS lobbies (
    -- 'lobby_id' is the primary key for the lobbies table, using a fixed-length string of 6 characters
    -- This ID uniquely identifies each lobby and includes leading zeros if necessary
    lobby_id CHAR(6) PRIMARY KEY,
    
    -- 'pod_id' stores the ID of the pod hosting the lobby
    -- INTEGER type is used, and a check constraint ensures it is between 1 and 100
    pod_id INTEGER NOT NULL CHECK (pod_id BETWEEN 1 AND 100),
    
    -- 'is_full' indicates whether the lobby is full (TRUE) or not (FALSE)
    -- BOOLEAN type is used, and the default value is set to FALSE (not full)
    is_full BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- 'host' stores the ID of the player who is the host of the lobby
    -- UUID type is used to match the 'id' field in the 'players' table
    host_id UUID NOT NULL
);

-- Notes:
-- 1. The 'players' table keeps track of individual players and the lobbies they are in.
-- 2. The 'lobby_id' column in the 'players' table allows us to enforce that each player can only be in one lobby at a time.
-- 3. The 'lobbies' table tracks the existence of lobbies, their hosting pods, their occupancy status (full or not), and the host player.
-- 4. The CHAR(6) data type for 'lobby_id' ensures that all lobby IDs have a consistent format, which includes leading zeros.
-- 5. The CHECK constraint on 'pod_id' ensures that it falls within the valid range of 1 to 100, matching your environment's requirements.
-- 6. The 'host' column references the UUID of the player who created the lobby, establishing a link between lobbies and their creators.

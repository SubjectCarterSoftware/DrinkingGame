package main

import (
	"doorman-api/internal/database"
	"doorman-api/internal/handlers"
	"log"
	"net/http"
	"os"
)

// Define the database connection string as a variable
var (
	dbUser        = "postgres"
	dbPassword    = "mysecretpassword"
	dbName        = "postgres"
	dbHost        = "localhost"
	dbSSLMode     = "disable"
	dbConnString  = ""
	dbInitialized bool
)

func init() {
	// Construct the connection string from the variables
	dbConnString = constructDBConnString()

	err := database.InitDB(dbConnString)
	if err != nil {
		log.Fatalf("Could not initialize database connection: %v", err)
	}

	dbInitialized = true
	log.Println("Database connection successfully initialized")
}

func main() {
	// Define HTTP routes and handlers
	http.HandleFunc("/create-new-player", withDBConnection(handlers.CreateNewPlayerID))
	http.HandleFunc("/create-lobby", withDBConnection(handlers.CreateLobby))
	http.HandleFunc("/leave-lobby", withDBConnection(handlers.LeaveLobby))
	http.HandleFunc("/join-lobby", withDBConnection(handlers.JoinLobby))

	// Start the HTTP server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // default port
	}
	log.Printf("Starting server on :%s...", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

// constructDBConnString constructs the database connection string from variables
func constructDBConnString() string {
	return "user=" + dbUser +
		" password=" + dbPassword +
		" dbname=" + dbName +
		" host=" + dbHost +
		" sslmode=" + dbSSLMode
}

// Middleware to ensure DB connection is alive before each request
func withDBConnection(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !dbInitialized || !database.IsDBAlive() {
			log.Println("Reinitializing database connection...")
			err := database.InitDB(dbConnString)
			if err != nil {
				http.Error(w, "Failed to initialize database connection", http.StatusInternalServerError)
				return
			}
			dbInitialized = true
			log.Println("Database connection reinitialized successfully")
		}
		// Proceed to the actual handler
		next.ServeHTTP(w, r)
	}
}

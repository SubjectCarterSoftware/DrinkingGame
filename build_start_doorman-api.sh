#!/bin/bash
cd ./Backend/doorman-api

# Step 3: Build the Go application
echo "Building the Go application..."
go build -o doorman ./cmd/doorman/

if [ $? -eq 0 ]; then
    echo "Build successful."

    # Step 4: Run the application in the background and log output
    echo "Starting the Go application in the background..."
    ./doorman > doorman.log 2>&1 &

    echo "Application started in the background. Output is being logged to doorman.log."
else
    echo "Build failed. Please check the errors above."
fi

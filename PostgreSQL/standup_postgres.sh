#!/bin/bash

# Define the image and container name
IMAGE_NAME="docker.io/library/postgres:latest"
CONTAINER_NAME="my-postgres-container"
POSTGRES_PASSWORD="mysecretpassword"
POSTGRES_PORT=5432

# Check if containerd is running
if ! pgrep -x "containerd" > /dev/null
then
    echo "Containerd is not running. Please start containerd before running this script."
    exit 1
fi

# Pull the latest PostgreSQL image using ctr
echo "Pulling the latest PostgreSQL image..."
sudo ctr image pull $IMAGE_NAME

./kill_postgres.sh

# Create a new container for PostgreSQL
echo "Creating a new PostgreSQL container..."
sudo ctr run --detach --net-host \
    --env POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    $IMAGE_NAME $CONTAINER_NAME

# Verify that the container is running
RUNNING=$(sudo ctr task list | grep $CONTAINER_NAME)

if [ -n "$RUNNING" ]; then
    echo "PostgreSQL container $CONTAINER_NAME is running."
    echo "You can connect to it at localhost:$POSTGRES_PORT with user 'postgres'."

    # Check if requirements.txt exists and install dependencies
    if [ -f requirements.txt ]; then
        echo "Installing Python dependencies..."
        pip3 install -r requirements.txt
    fi

    # Run the Python script to set up the database
    echo "Running the Python script to set up the database..."
    python3 setup_postgres.py

    if [ $? -eq 0 ]; then
        echo "Database setup completed successfully."
    else
        echo "There was an issue running the database setup script."
    fi
else
    echo "Failed to start the PostgreSQL container."
fi

#!/bin/bash

# Define the container name
CONTAINER_NAME="my-postgres-container"

# Check if containerd is running
if ! pgrep -x "containerd" > /dev/null
then
    echo "Containerd is not running. Please start containerd before running this script."
    exit 1
fi

# Check if the container is running
RUNNING_CONTAINER=$(sudo ctr task list | grep $CONTAINER_NAME)

if [ -n "$RUNNING_CONTAINER" ]; then
    echo "Stopping the running container named $CONTAINER_NAME..."
    sudo ctr task kill $CONTAINER_NAME

    # Wait for the container to stop
    sleep 2  # Small delay to ensure the container is stopped
    RUNNING_CONTAINER=$(sudo ctr task list | grep $CONTAINER_NAME)

    if [ -n "$RUNNING_CONTAINER" ]; then
        echo "The container $CONTAINER_NAME is still running. Attempting to stop it again..."
        sudo ctr task kill $CONTAINER_NAME
    else
        echo "The container $CONTAINER_NAME has been stopped."
    fi
else
    echo "No running container named $CONTAINER_NAME found."
fi

# Remove the container if it exists
EXISTING_CONTAINER=$(sudo ctr container list | grep $CONTAINER_NAME)

if [ -n "$EXISTING_CONTAINER" ]; then
    echo "Removing the container named $CONTAINER_NAME..."
    sudo ctr container delete $CONTAINER_NAME

    # Verify the container is removed
    EXISTING_CONTAINER=$(sudo ctr container list | grep $CONTAINER_NAME)
    if [ -n "$EXISTING_CONTAINER" ]; then
        echo "Failed to remove the container $CONTAINER_NAME."
    else
        echo "Container $CONTAINER_NAME has been removed."
    fi
else
    echo "No container named $CONTAINER_NAME exists."
fi

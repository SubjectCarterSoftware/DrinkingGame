#!/bin/bash

# Find the PID of the running doorman process using ps and grep
PID=$(ps aux | grep './doorman' | grep -v 'grep' | awk '{print $2}')

if [ -z "$PID" ]; then
    echo "No running doorman process found."
else
    # Kill the process
    kill $PID

    if [ $? -eq 0 ]; then
        echo "Go application with PID $PID has been stopped."
    else
        echo "Failed to stop the Go application with PID $PID."
    fi
fi
